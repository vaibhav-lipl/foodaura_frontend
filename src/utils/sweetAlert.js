import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const baseOptions = {
  customClass: {
    popup: 'theme-swal-popup',
    title: 'theme-swal-title',
    htmlContainer: 'theme-swal-text',
    confirmButton: 'theme-swal-confirm',
    cancelButton: 'theme-swal-cancel',
    actions: 'theme-swal-actions',
    icon: 'theme-swal-icon',
  },
  buttonsStyling: false,
  reverseButtons: true,
  focusCancel: true,
};

export const confirmDelete = async ({
  title = 'Are you sure?',
  text = "You won't be able to revert this!",
  confirmButtonText = 'Yes, delete it!',
  cancelButtonText = 'Cancel',
} = {}) => {
  const result = await Swal.fire({
    ...baseOptions,
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
  });

  return result.isConfirmed;
};

export const showDeleteSuccess = async ({
  title = 'Deleted!',
  text = 'The item has been deleted successfully.',
  confirmButtonText = 'OK',
} = {}) => {
  return Swal.fire({
    ...baseOptions,
    title,
    text,
    icon: 'success',
    showCancelButton: false,
    confirmButtonText,
    reverseButtons: false,
    focusConfirm: true,
  });
};
