import Icons from "./Icons";

const PageLoader = () => (
  <div className="flex items-center justify-center h-full p-8">
    <Icons name="Loader2" size={24} className="animate-spin text-primary" />
  </div>
);

export default PageLoader;
