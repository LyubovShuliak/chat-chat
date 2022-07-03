const timeFormationInMessage = (time: string) => {
  const options: {
    month: "short";
    day: "numeric";
  } = {
    month: "short",
    day: "numeric",
  };
  return new Intl.DateTimeFormat("en-US", options).format(new Date(time));
};
const sendTime = (time: string) => {
  const options: {
    hour: "numeric";
    minute: "numeric";
    hour12: boolean;
  } = {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };
  return new Intl.DateTimeFormat("en-US", options).format(new Date(time));
};

export { timeFormationInMessage, sendTime };
