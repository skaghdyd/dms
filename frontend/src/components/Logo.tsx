import { SvgIcon, SvgIconProps } from "@mui/material";

const Logo = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props} viewBox="0 0 36 36">
      <path
        fill="currentColor"
        d="M18 3C9.716 3 3 9.716 3 18c0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15z"
        opacity="0.2"
      />
      <path
        fill="currentColor"
        d="M11 12c-.552 0-1 .448-1 1v10c0 .552.448 1 1 1h14c.552 0 1-.448 1-1V13c0-.552-.448-1-1-1H11zm1 2h12v8H12v-8z"
      />
      <path fill="currentColor" d="M14 15h8v2h-8z" />
      <path fill="currentColor" d="M14 19h6v1h-6z" />
      <path
        fill="currentColor"
        d="M26 10h-1V9c0-1.105-.895-2-2-2H13c-1.105 0-2 .895-2 2v1h-1c-1.105 0-2 .895-2 2v12c0 1.105.895 2 2 2h16c1.105 0 2-.895 2-2V12c0-1.105-.895-2-2-2zm-14-1c0-.552.448-1 1-1h10c.552 0 1 .448 1 1v1H12V9zm14 15c0 .552-.448 1-1 1H11c-.552 0-1-.448-1-1V12c0-.552.448-1 1-1h14c.552 0 1 .448 1 1v12z"
      />
    </SvgIcon>
  );
};

export default Logo;
