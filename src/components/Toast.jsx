import { toast, Toaster, ToastBar } from 'react-hot-toast'

export default function ToastMessage () {
  return (
    <Toaster position='bottom-right'>
      {t => (
        <ToastBar toast={t}>
          {({ icon, message }) => (
            <>
              {icon}
              {message}
              {t.type !== 'loading' && (
                <button onClick={() => toast.dismiss(t.id)}>X</button>
              )}
            </>
          )}
        </ToastBar>
      )}
    </Toaster>
  )
}
