import { GlobalContextDispatch } from "@/app/state/context/globalContextProvider";
import { useContext } from "react";

const NavbarIcon = ({ Icon, name }) => {
  const dispatch = useContext(GlobalContextDispatch)
  const handleClickIcon=()=>{
if (name==="Add") {
  dispatch({
    type:'SET_IS_UPLOAD_POST_MODAL_OPEN',
    payload:{
      setIsUploadPostOpen:true,
    }
  })
}
  }
  return (
    <div
    onClick={handleClickIcon}
    className='p-1 hover:bg-gray-900 cursor-pointer rounded transition hover:text-white'>
      <Icon size="25" />
    </div>
  );
};

export default NavbarIcon;
