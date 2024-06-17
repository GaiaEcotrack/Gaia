import { MdOutlineMarkEmailUnread } from "react-icons/md"; 
import Swal from "sweetalert2";
import { sendEmailVerification } from "firebase/auth";
import { getAuth, signOut } from "firebase/auth";
import { Link } from "react-router-dom";

interface MoodalSms {
  showEmailVerify: boolean;
  setShowEmailVerify(showEmailVerify: boolean): void;
}

function EmailVerify(props:MoodalSms) {

  const { showEmailVerify, setShowEmailVerify } = props;
  const auth = getAuth();
  const user = auth.currentUser;

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  }); 

  const handleSendEmail = async () => {
    try {
      if (user) { 
        await sendEmailVerification(user);
        Toast.fire({
          icon: 'success',
          title: 'Email sent'
        });
      } else {
        Toast.fire({
          icon: 'error',
          title: 'Email is null'
        });
      }
    } catch (error) {
      Toast.fire({
        icon: 'error',
        title: 'Error sending the email'
      });
    }
  };

  const handleVerifiedOk = async() => {    
    try {      
      await signOut(auth);
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      localStorage.removeItem("profilePic");
      localStorage.removeItem('id');
      localStorage.removeItem('completeCredent');
      localStorage.removeItem('pendingDocs');
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: "ESomething went wrong"
      });
      console.error("Something went wrong:", error);
    }
  }
  
  return showEmailVerify ? (
    <div className="bg-[#00000054] backdrop-blur-sm fixed top-0 left-0 h-full w-full flex justify-center items-center text-black">
        
        <div className="flex flex-col justify-center items-center rounded-3xl bg-[#ffffff] h-[50%] xl:h-[29rem] w-full md:w-[50%] xl:w-[41rem] p-4 md:p-6 mt-40 md:mt-0">
          
        <div className="flex flex-row items-end mb-12" >
          <h1 className="text-xl md:text-2xl">
            Confirm your Email and send
          </h1>   
            <MdOutlineMarkEmailUnread className="text-5xl ml-4"/>           
        </div>

          <div className="flex justify-center items-center gap-6 mb-10 w-full">
            <div className="pb-1 px-4">
              <h1 className="text-xl">
              {user?.email}
              </h1>
            </div>

            <button
              onClick={handleSendEmail}
              className="bg-[#4caf4f] hover:bg-[#3ea442] w-[30%] h-10 flex gap-1 items-center justify-center py-2.5 text-lg text-white rounded"
              >
              Send
            </button>
          </div> 

          <div>
            <h1 className="text-center font-normal text-2xl mb-10">
            Now go to your email account, check your inbox or spam and follow the instructions to verify. Then go back and click ¡Ok! to log in again.
            </h1>
          </div>

          <Link to="/" className="bg-[#4caf4f] hover:bg-[#3ea442] w-[30%] flex gap-1 items-center justify-center py-2.5 text-lg text-white rounded">
            <button onClick={handleVerifiedOk}>
              ¡Ok!
            </button>
          </Link>

          <button
            type="button"
            onClick={() => {setShowEmailVerify(false)}}  
            className="bg-blue-500 hover:bg-[#ef4444db] w-[17%] flex gap-1 items-center justify-center py-1 text-lg text-white rounded mt-4"          
            >
            Cancel
          </button>
          
        </div>
      </div>
    ) : null
  }

  export { EmailVerify };