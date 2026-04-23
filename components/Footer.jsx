const Footer = () => {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-red-600 rounded-sm flex items-center justify-center transform -skew-x-12">
                <span className="text-white text-xs font-bold italic">
                  FH
                </span>
              </div>

              <span className="font-bold text-lg tracking-wider text-white uppercase">
                Horizon<span className="text-red-500">Wiki</span>
              </span>
            </div>

            <p className="text-neutral-400 text-sm max-w-sm">
              The ultimate community-driven destination for all information
              regarding Forza Horizon 6. Covering vehicles, map locations,
              festival playlists, and tuning setups.
            </p>
          </div>

          {/* Wiki Links */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-4">
              Wiki Links
            </h4>

            <ul className="space-y-2 text-sm text-neutral-400">
              {[
                "Car List",
                "Map Viewer",
                "The Art of Driving",
                "Barn Finds",
              ].map((item, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="hover:text-red-500 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-4">
              Community
            </h4>

            <ul className="space-y-2 text-sm text-neutral-400">
              {[
                "Discord Server",
                "Reddit Forums",
                "Contribute",
                "Guidelines",
              ].map((item, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="hover:text-red-500 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4">
          
          <p className="text-neutral-500 text-xs text-center md:text-left">
            © 2026 HorizonWiki. Not affiliated with Playground Games or Xbox Game Studios.
          </p>

          <div className="flex gap-4 text-xs text-neutral-500">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;