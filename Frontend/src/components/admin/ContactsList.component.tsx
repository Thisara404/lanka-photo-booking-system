import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, Eye } from "lucide-react";
import ContactService from "@/services/contact.service";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

export default function ContactsList() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  
  // Fetch contacts when component mounts
  useEffect(() => {
    fetchContacts();
  }, []);
  
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await ContactService.getAllContacts();
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast({
        title: "Error",
        description: "Failed to load contact messages.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleOpenDetails = async (contactId) => {
    try {
      const response = await ContactService.getContactById(contactId);
      setSelectedContact(response.data);
    } catch (error) {
      console.error("Error fetching contact details:", error);
      toast({
        title: "Error",
        description: "Failed to load contact details.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteContact = async () => {
    if (!contactToDelete) return;
    
    try {
      setIsDeleting(true);
      await ContactService.deleteContact(contactToDelete);
      
      // Close the selected contact dialog if we're deleting the currently viewed contact
      if (selectedContact && selectedContact._id === contactToDelete) {
        setSelectedContact(null);
      }
      
      setContacts(prev => prev.filter(contact => contact._id !== contactToDelete));
      
      toast({
        title: "Contact deleted",
        description: "The contact message has been removed.",
      });
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast({
        title: "Delete failed",
        description: "Failed to delete the contact message.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setContactToDelete(null);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Contact Messages</CardTitle>
            <CardDescription>View and manage customer inquiries</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={fetchContacts}
          >
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {contacts.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contacts.map((contact) => (
                    <tr key={contact._id} className={!contact.read ? "bg-blue-50" : ""}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                        <div className="text-sm text-gray-500">{contact.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        {!contact.read && <span className="inline-block w-2 h-2 mr-2 bg-blue-600 rounded-full"></span>}
                        {contact.subject || "No Subject"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {format(new Date(contact.createdAt), 'PPP')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleOpenDetails(contact._id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => setContactToDelete(contact._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No contact messages found.
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Message View Dialog */}
      {selectedContact && (
        <Dialog open={Boolean(selectedContact)} onOpenChange={() => setSelectedContact(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedContact.subject || "No Subject"}</DialogTitle>
              <DialogDescription>
                From: {selectedContact.name} ({selectedContact.email})
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
              <p className="whitespace-pre-wrap">{selectedContact.message}</p>
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Received on {format(new Date(selectedContact.createdAt), 'PPP')}
            </div>
            <DialogFooter className="mt-6">
              <Button 
                variant="destructive" 
                onClick={() => setContactToDelete(selectedContact._id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setSelectedContact(null)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={Boolean(contactToDelete)} onOpenChange={() => setContactToDelete(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this contact message? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button 
              variant="destructive" 
              onClick={handleDeleteContact}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setContactToDelete(null)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}