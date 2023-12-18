const NavbarIcon = ({ Icon, name }) => {
  return (
    <div className='p-1 hover:bg-gray-900 cursor-pointer rounded transition hover:text-white'>
      <Icon size="25" />
    </div>
  );
};

export default NavbarIcon;
