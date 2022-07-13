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
function isScrolledIntoView(el: HTMLDivElement) {
  const rect = el.getBoundingClientRect();
  const elemTop = rect.top;
  const elemBottom = rect.bottom;

  const isVisible = elemTop >= 0 && elemBottom <= window.innerHeight;

  return isVisible;
}

export { timeFormationInMessage, sendTime, isScrolledIntoView };
