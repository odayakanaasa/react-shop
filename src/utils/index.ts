import ScrollToTop from "./ScrollToTop";

export { ScrollToTop };

export const getMapFromSearch = search => {
  return new Map(
    search.replace("?", "").split("&").map(item => item.split("="))
  );
};
