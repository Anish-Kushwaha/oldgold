import anishPhoto from "@/assets/Anish.png";
import { Github, Linkedin, Twitter, Youtube, Mail, Globe, Code, Trophy, Gamepad2, Send, Facebook } from "lucide-react";

const links = [
  { icon: Globe, label: "Portfolio", url: "https://Anish-kushwaha.online" },
  { icon: Github, label: "GitHub", url: "https://github.com/Anish-Kushwaha" },
  { icon: Linkedin, label: "LinkedIn", url: "https://www.linkedin.com/in/anish-kushwaha-43a915383" },
  { icon: Twitter, label: "X (Twitter)", url: "https://x.com/Anish_Kushwaha_" },
  { icon: Facebook, label: "Facebook", url: "https://www.facebook.com/Anishkushwahaji2" },
  { icon: Youtube, label: "YouTube", url: "https://www.youtube.com/@cosmologist_anish" },
  { icon: Send, label: "Telegram", url: "https://t.me/AnishKushwahaji" },
  { icon: Code, label: "LeetCode", url: "https://leetcode.com/Anish-Kushwaha" },
  { icon: Code, label: "Devpost", url: "https://devpost.com/Anish-Kushwaha" },
  { icon: Trophy, label: "HackerRank", url: "https://www.hackerrank.com/profile/Anish_Kushwaha" },
  { icon: Gamepad2, label: "Chess.com", url: "https://www.chess.com/member/Anish-Kushwaha" },
];

const emails = [
  { label: "Primary Email", address: "Anish-Kushwaha@zohomail.in" },
  { label: "Privacy Email", address: "Anish_Kushwaha@proton.me" },
  { label: "Personal Gmail", address: "Anishkushwahag2@gmail.com" },
];

const ContactPage = () => {
  return (
    <div className="animate-fade-in">
      <div className="bg-card border-b border-border">
        <div className="container py-8">
          <h2 className="font-display text-3xl font-bold">Contact — The Creator</h2>
        </div>
      </div>

      <div className="container py-12 max-w-4xl">
        <div className="bg-card rounded-lg border border-border overflow-hidden md:flex">
          {/* Photo side */}
          <div className="md:w-1/3 bg-foreground flex flex-col items-center justify-center p-8">
            <img
              src={anishPhoto}
              alt="Anish Kushwaha"
              className="w-40 h-40 rounded-full object-cover border-4 border-primary mb-4"
            />
            <h3 className="font-display text-xl font-bold text-primary-foreground">ANISH KUSHWAHA</h3>
            <p className="text-background/60 text-xs text-center mt-2 leading-relaxed">
              Student • Engineer • Cybersecurity Enthusiast<br />
              Web Developer • Research-Oriented Thinker
            </p>
            <p className="text-primary text-xs italic mt-3 text-center">
              "I don't follow the universe — I reprogram it."
            </p>
          </div>

          {/* Links side */}
          <div className="md:w-2/3 p-6 space-y-6">
            <div>
              <h4 className="font-display font-bold text-sm uppercase text-muted-foreground mb-3 tracking-wider">Social & Platforms</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-secondary transition-colors group"
                  >
                    <link.icon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-body group-hover:text-primary transition-colors">{link.label}</span>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-display font-bold text-sm uppercase text-muted-foreground mb-3 tracking-wider">Email Addresses</h4>
              <div className="space-y-2">
                {emails.map((email) => (
                  <a
                    key={email.address}
                    href={`mailto:${email.address}`}
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-secondary transition-colors group"
                  >
                    <Mail className="h-4 w-4 text-primary" />
                    <div>
                      <span className="text-xs text-muted-foreground">{email.label}</span>
                      <p className="text-sm font-body group-hover:text-primary transition-colors">{email.address}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
