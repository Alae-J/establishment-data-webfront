
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

interface CellEditorProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onSave: (value: string) => void;
  cellLabel: string;
  rowLabel: string;
  columnLabel: string;
}

export default function CellEditor({
  isOpen,
  onClose,
  value,
  onSave,
  cellLabel,
  rowLabel,
  columnLabel,
}: CellEditorProps) {
  const [editedValue, setEditedValue] = useState(value);

  const handleSave = () => {
    onSave(editedValue);
    onClose();
  };

  const handleCancel = () => {
    setEditedValue(value); // Reset to original value
    onClose();
  };

  // Reset edited value when dialog opens with new value
  useState(() => {
    setEditedValue(value);
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-earth-800">
            Éditer la cellule {cellLabel}
          </DialogTitle>
          <DialogDescription className="text-earth-600">
            {rowLabel} × {columnLabel}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Textarea
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            placeholder="Saisissez votre contenu ici..."
            className="min-h-[200px] resize-none border-earth-200 focus:border-forest-500"
            autoFocus
          />
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="border-earth-300 text-earth-700 hover:bg-earth-50"
          >
            Annuler
          </Button>
          <Button
            onClick={handleSave}
            className="bg-forest-600 hover:bg-forest-700 text-white"
          >
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
