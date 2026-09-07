function Loader() {
  return (
    <div className="common-loader" role="status" aria-live="polite">
      <div className="common-loader-spinner" />

      <span className="common-loader-text">Loading...</span>
    </div>
  );
}

export default Loader;
