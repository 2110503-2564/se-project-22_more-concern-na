import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface AlertConfirmationProps {
  onOpen: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'delete' | 'edit' | 'create';
  onConfirm: () => void;
  onCancel?: () => void;
}

export default function AlertConfirmation({
  onOpen,
  onOpenChange,
  type,
  onConfirm,
  onCancel,
}: AlertConfirmationProps) {
  let titleText = '';
  let descriptionText = '';
  let confirmButtonText = '';

  switch (type) {
    case 'delete':
      titleText = 'Confirm Deletion';
      descriptionText =
        'Are you sure you want to delete this? This action cannot be undone.';
      confirmButtonText = 'Yes, Delete';
      break;
    case 'edit':
      titleText = 'Confirm Edit';
      descriptionText = 'Are you sure you want to save these changes?';
      confirmButtonText = 'Save Changes';
      break;
    case 'create':
      titleText = 'Confirm Creation';
      descriptionText = 'Do you want to create this item?';
      confirmButtonText = 'Create';
      break;
    default:
      titleText = 'Confirm';
      descriptionText = 'Are you sure?';
      confirmButtonText = 'Confirm';
      break;
  }
  return (
    <div>
      <AlertDialog open={onOpen} onOpenChange={onOpenChange}>
        <AlertDialogContent className='bg-bg-box border text-white'>
          <AlertDialogHeader>
            <AlertDialogTitle className='text-2xl text-gold-gd1 font-heading'>
              {titleText}
            </AlertDialogTitle>
            <AlertDialogDescription className='text-gray-300 font-medium text-base font-detail'>
              {descriptionText}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className='mt-4'>
            <AlertDialogCancel
              className='border-gray-600 font-detail text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-700'
              data-testid='alert-cancel-button'
              onClick={onCancel}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-testid='alert-confirm-button'
              onClick={onConfirm}
              className='font-detail text-sm font-medium bg-gradient-to-r from-gold-gd1 to-gold-gd2 hover:bg-gradient-to-bl hover:from-gold-gd1 hover:to-gold-gd2 text-cardfont-cl'
            >
              {confirmButtonText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
