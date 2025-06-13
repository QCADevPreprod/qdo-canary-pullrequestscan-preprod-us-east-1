// ruleid: javascript-mui-snackbar-message
enqueueSnackbar('Registration success, Please verify your email', {
    variant: 'success',
    action: key => (
      <MIconButton size="small" onClick={() => closeSnackbar(key)}>
        <Icon icon={closeFill} />
      </MIconButton>
    ),
  });
  
  const handleSnackbarAction =(key) => (
     <MIconButton size="small" onClick={() => closeSnackbar(key)}>
        <Icon icon={closeFill} />
      </MIconButton> 
  );
  // ruleid: javascript-mui-snackbar-message
  enqueueSnackbar('Registration success, Please verify your email', {
    variant: 'success',
    action: handleSnackbarAction
  })
  
  // ok: javascript-mui-snackbar-message
  enqueueSnackbar(t('Registration success, Please verify your email'), {
    variant: 'success',
    action: key => (
      <MIconButton size="small" onClick={() => closeSnackbar(key)}>
        <Icon icon={closeFill} />
      </MIconButton>
    ),
  });