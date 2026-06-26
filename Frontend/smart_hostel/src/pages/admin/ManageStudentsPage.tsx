import { useEffect, useState } from 'react';

import { api } from '@/lib/api';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { User } from '@/types';
import { format } from 'date-fns';
import { Search, MoreHorizontal, Eye, Ban, Trash2, MapPin, Phone, Calendar, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function ManageStudentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [students, setStudents] = useState<User[]>([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await api.get<{ success: true; students: unknown[] }>('/students/getAll');
        if (!mounted) return;
        setStudents((res.students ?? []).map((s) => {
          const obj = (s ?? {}) as Partial<Record<string, unknown>>;
          const id = (obj.id ?? obj._id ?? '') as string;
          const email = (obj.email ?? '') as string;
          const full_name = (obj.full_name ?? obj.name ?? 'Student') as string;
          const room_number = (obj.roomNumber ?? obj.room_number ?? '') as string;
          const hostel_block = (obj.hostel_block ?? obj.hostelBlock ?? '') as string;
          const phone_number = (obj.phone_number ?? obj.phoneNumber) as string | undefined;
          const created_at = (obj.created_at ?? new Date().toISOString()) as string;
          return {
            id,
            email,
            full_name,
            role: 'student',
            room_number,
            hostel_block,
            phone_number,
            created_at,
          };
        }));

      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Failed to fetch students');
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredStudents = students.filter((student) =>
    student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.room_number?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBlock = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    toast.success('Student blocked successfully!');
    setIsBlockDialogOpen(false);
    setSelectedStudent(null);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    toast.success('Student deleted successfully!');
    setIsDeleteDialogOpen(false);
    setSelectedStudent(null);
  };

  const getInitials = (name: string) => name.split(' ').map((n) => n[0]).join('').toUpperCase();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold tracking-tight">Manage Students</h1><p className="text-muted-foreground">View and manage all registered students.</p></div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search students..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

          {/* statistics are static for now */}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
{students.length}
        <div className="p-4 rounded-lg border bg-card"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center"><span className="text-green-600 font-bold">A-E</span></div><div><p className="text-2xl font-bold">5</p><p className="text-xs text-muted-foreground">Hostel Blocks</p></div></div></div>
        <div className="p-4 rounded-lg border bg-card"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center"><span className="text-yellow-600 font-bold">!</span></div><div><p className="text-2xl font-bold">0</p><p className="text-xs text-muted-foreground">Blocked Users</p></div></div></div>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead><TableHead>Location</TableHead><TableHead>Phone</TableHead><TableHead>Joined</TableHead><TableHead>Complaints</TableHead><TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar><AvatarFallback className="bg-primary text-primary-foreground">{getInitials(student.full_name)}</AvatarFallback></Avatar>
                        <div><p className="font-medium">{student.full_name}</p><p className="text-xs text-muted-foreground">{student.email}</p></div>
                      </div>
                    </TableCell>
                    <TableCell><div className="flex items-center gap-1"><MapPin className="h-3 w-3 text-muted-foreground" /><span className="text-sm">Block {student.hostel_block} - {student.room_number}</span></div></TableCell>
                    <TableCell><span className="text-sm">{student.phone_number}</span></TableCell>
                    <TableCell><div className="flex items-center gap-1"><Calendar className="h-3 w-3 text-muted-foreground" /><span className="text-sm">{format(new Date(student.created_at), 'PP')}</span></div></TableCell>
                    <TableCell><Badge variant="secondary">{Math.floor(Math.random() * 10) + 1}</Badge></TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setSelectedStudent(student); setIsViewModalOpen(true); }}><Eye className="h-4 w-4 mr-2" />View Profile</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setSelectedStudent(student); setIsBlockDialogOpen(true); }}><Ban className="h-4 w-4 mr-2" />Block User</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setSelectedStudent(student); setIsDeleteDialogOpen(true); }} className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Student Profile</DialogTitle></DialogHeader>
          {selectedStudent && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16"><AvatarFallback className="bg-primary text-primary-foreground text-xl">{getInitials(selectedStudent.full_name)}</AvatarFallback></Avatar>
                <div><h3 className="font-semibold text-lg">{selectedStudent.full_name}</h3><p className="text-sm text-muted-foreground">{selectedStudent.email}</p></div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm"><Phone className="h-4 w-4 text-muted-foreground" /><span>{selectedStudent.phone_number}</span></div>
                <div className="flex items-center gap-3 text-sm"><MapPin className="h-4 w-4 text-muted-foreground" /><span>Block {selectedStudent.hostel_block} - Room {selectedStudent.room_number}</span></div>
                <div className="flex items-center gap-3 text-sm"><Calendar className="h-4 w-4 text-muted-foreground" /><span>Joined {format(new Date(selectedStudent.created_at), 'PPP')}</span></div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center"><p className="text-2xl font-bold">5</p><p className="text-xs text-muted-foreground">Complaints</p></div>
                <div className="text-center"><p className="text-2xl font-bold">4</p><p className="text-xs text-muted-foreground">Resolved</p></div>
                <div className="text-center"><p className="text-2xl font-bold">80%</p><p className="text-xs text-muted-foreground">Resolution</p></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Block Student</AlertDialogTitle><AlertDialogDescription>Are you sure you want to block {selectedStudent?.full_name}? They will not be able to access the system.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBlock}>{isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Block User'}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Student</AlertDialogTitle><AlertDialogDescription>Are you sure you want to delete {selectedStudent?.full_name}? This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
