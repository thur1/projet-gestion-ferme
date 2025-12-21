/**
 * Index des exports pour shared/components
 */

// Layout
export { AppLayout } from './layout/AppLayout';

// Common
export { EmptyState } from './common/EmptyState';
export { StatCard } from './common/StatCard';
export { 
  Spinner, 
  PageLoader, 
  FullPageLoader,
  Skeleton,
  CardSkeleton,
  TableSkeleton 
} from './common/LoadingStates';

// UI (re-exports depuis shadcn)
export { Button } from './ui/button';
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
export { Input } from './ui/input';
export { Label } from './ui/label';
export { Badge } from './ui/badge';
export { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
export { Separator } from './ui/separator';
export { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
export { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from './ui/dialog';
export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
export {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
export { Textarea } from './ui/textarea';
export { Skeleton as UISkeleton } from './ui/skeleton';
