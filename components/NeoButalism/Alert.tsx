import { TbAlertOctagonFilled, TbMessageCircle } from 'react-icons/tb' // Import TbMessageCircle

export default function Alert({ message, backgroundColor }: { message: string, backgroundColor:string }) {
  return (
    <div
      role="alert"
      className={`${backgroundColor} flex text-black items-center justify-center rounded-md border-2 border-black  p-5 px-8 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
      >
      {/* <TbAlertOctagonFilled className="mr-3 h-6 min-h-[24px] w-6 min-w-[24px]" /> */}
      {/* <TbMessageCircle className="mr-3 h-6 min-h-[24px] w-6 min-w-[24px]" />  */}
      {/* Add the chat icon */}
      {message}
    </div>
  )
}