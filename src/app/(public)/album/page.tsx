const Page = () => {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-4xl items-center px-4 py-12">
      <div className="rounded-[2rem] border border-border/70 bg-card/90 p-8 shadow-sm">
        <p className="mb-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Shared Galleries
        </p>
        <h1 className="mb-3 text-3xl font-semibold tracking-tight">
          Open a gallery using the full album link.
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Photographers share albums with links like <code>/album/your-slug</code>.
          Private galleries ask for the client email and access code, while
          public ones collect an email before showing the photos.
        </p>
      </div>
    </div>
  );
};

export default Page;
