import React, { useState } from "react";

const useProfileFeatures = () => {
  const [state, setState] = useState({
    left: false,
  });
  const [focused, setFocused] = useState(false);

  const focusSearchBar = () => {
    setFocused(!focused);
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ left: open });
    };

  return {
    toggleDrawer,
    focusSearchBar,
    handleOpen,
    handleClose,
    open,
    focused,
    state,
  };
};

export default useProfileFeatures;
