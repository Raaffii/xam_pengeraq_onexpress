import { Button } from "../ui/button";
import { InputField } from "../common";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Mail, User } from "lucide-react";

const MemberModal = ({ open = false, onOpenChange, data }) => {
  const member = data?.member || {};

  if (!data?.member) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-700">Member Details</DialogTitle>
          <DialogDescription>View Member Details</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name */}
          <InputField
            id="name"
            name="name"
            label="Member Name"
            value={member.memberName}
            isRequired
            disabled
            inputClassName="bg-gray-50 text-black font-semibold"
            icon={User}
          />
          {/* Email */}
          <InputField
            id="email"
            name="memberEmail"
            label="Member Email"
            value={member.memberEmail}
            isRequired
            disabled
            inputClassName="bg-gray-50 text-black font-semibold"
            icon={Mail}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              onClick={() => {
                onOpenChange(false);
              }}
              className="h-10 bg-gray-700 text-white"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MemberModal;
