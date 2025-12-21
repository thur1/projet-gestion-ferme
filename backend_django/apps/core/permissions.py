from rest_framework import permissions

from .models import Membership, Enterprise, Farm, Unit, Lot, StockItem


def get_enterprise_from_obj(obj):
    if hasattr(obj, 'enterprise'):
        return obj.enterprise
    if isinstance(obj, Farm):
        return obj.enterprise
    if isinstance(obj, Unit):
        return obj.farm.enterprise
    if isinstance(obj, Lot):
        return obj.unit.farm.enterprise
    if isinstance(obj, StockItem):
        return obj.farm.enterprise
    if hasattr(obj, 'lot') and hasattr(obj.lot, 'unit'):
        return obj.lot.unit.farm.enterprise
    return None


def user_role_in_enterprise(user, enterprise):
    if not enterprise or not user.is_authenticated:
        return None
    if enterprise.owner_id == user.id:
        return 'owner'
    membership = Membership.objects.filter(user=user, enterprise=enterprise, is_deleted=False).first()
    return membership.role if membership else None


class IsEnterpriseMember(permissions.BasePermission):
    message = 'Access limité aux membres de l\'entreprise.'

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        enterprise = get_enterprise_from_obj(obj)
        if not enterprise:
            return False
        return user_role_in_enterprise(request.user, enterprise) is not None
