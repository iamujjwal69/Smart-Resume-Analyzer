import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type Application = {
  id?: string;
  company: string;
  role: string;
  status: string;
  jobUrl?: string;
  salaryRange?: string;
  location?: string;
  jobType?: string;
  priority?: string;
  notes?: string;
};

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application | null;
  onSave: () => void;
}

export function ApplicationModal({ isOpen, onClose, application, onSave }: ApplicationModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Application>({
    company: "",
    role: "",
    status: "WISHLIST",
    jobUrl: "",
    salaryRange: "",
    location: "",
    jobType: "",
    priority: "MEDIUM",
    notes: "",
  });

  useEffect(() => {
    if (application) {
      setFormData(application);
    } else {
      setFormData({
        company: "",
        role: "",
        status: "WISHLIST",
        jobUrl: "",
        salaryRange: "",
        location: "",
        jobType: "",
        priority: "MEDIUM",
        notes: "",
      });
    }
  }, [application, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = application?.id ? `/api/applications/${application.id}` : "/api/applications";
      const method = application?.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save application");

      toast.success(`Application ${application ? "updated" : "added"} successfully.`);
      onSave();
      onClose();
    } catch (error) {
      toast.error("Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{application ? "Edit Application" : "Add New Application"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company <span className="text-red-500">*</span></Label>
              <Input id="company" name="company" value={formData.company} onChange={handleChange} required placeholder="e.g. Google" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role <span className="text-red-500">*</span></Label>
              <Input id="role" name="role" value={formData.role} onChange={handleChange} required placeholder="e.g. Software Engineer" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(v) => handleSelectChange("status", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WISHLIST">Wishlist</SelectItem>
                  <SelectItem value="APPLIED">Applied</SelectItem>
                  <SelectItem value="ONLINE_ASSESSMENT">Assessment</SelectItem>
                  <SelectItem value="INTERVIEW">Interviewing</SelectItem>
                  <SelectItem value="OFFER">Offer</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(v) => handleSelectChange("priority", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Remote, NY" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salaryRange">Salary Range</Label>
              <Input id="salaryRange" name="salaryRange" value={formData.salaryRange} onChange={handleChange} placeholder="e.g. $120k - $150k" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobUrl">Job URL</Label>
            <Input id="jobUrl" name="jobUrl" type="url" value={formData.jobUrl} onChange={handleChange} placeholder="https://..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} placeholder="Any details, contact names, or context..." rows={3} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
