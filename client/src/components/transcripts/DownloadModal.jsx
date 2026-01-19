import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Download } from "lucide-react";

export const DownloadModal = ({
  isOpen,
  onClose,
  onConfirm,
  selectedCount,
}) => {
  const [selectedDocs, setSelectedDocs] = useState({
    transcript: false,
    attendance: false,
  });

  const handleCheckboxChange = (docType) => {
    setSelectedDocs((prev) => ({
      ...prev,
      [docType]: !prev[docType],
    }));
  };

  const handleConfirm = () => {
    onConfirm(selectedDocs);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Download Documents</DialogTitle>
          <DialogDescription>
            Select documents to download for {selectedCount} selected student
            {selectedCount > 1 ? "s" : ""}:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="transcript"
              checked={selectedDocs.transcript}
              onCheckedChange={() => handleCheckboxChange("transcript")}
            />
            <Label
              htmlFor="transcript"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Academic Transcript
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="attendance"
              checked={selectedDocs.attendance}
              onCheckedChange={() => handleCheckboxChange("attendance")}
            />
            <Label
              htmlFor="attendance"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Attendance
            </Label>
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!Object.values(selectedDocs).some(Boolean)}
          >
            <Download className="w-4 h-4 mr-2" />
            Print Selected
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
