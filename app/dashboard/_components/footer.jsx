export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 pt-4 bg-slate-950 text-slate-400 py-4 flex justify-center">
      <p className="text-sm text-center">
        © {new Date().getFullYear()} Built with ❤️ by{" "}
        <span className="text-emerald-400 font-medium">
          Shubham Kasture
        </span>
      </p>
    </footer>
  );
}
