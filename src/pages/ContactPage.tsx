import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import anishPhoto from "@/assets/Anish.png";
import {
  Github, Linkedin, Twitter, Youtube, Mail, Globe, Code, Trophy,
  Gamepad2, Send, Facebook, Phone, MessageCircle, Crown, Star,
  Shield, ExternalLink, Building2
} from "lucide-react";

const iconMap: Record<string, any> = {
  Globe, Github, Linkedin, Twitter, Facebook, Youtube, Send, Code, Trophy, Gamepad2, Mail,
};

// Fallback photos by name
const photoMap: Record<string, string> = {
  "Anish Kushwaha": anishPhoto,
  "Bhavya Pandey": bhavyaPhoto,
  "Shubham Prakash": shubhamPhoto,
  "Priyanshi Bairagi": piyuPhoto,
};

interface TeamMember {
  id: string;
  name: string;
  title: string;
  role_label: string;
  description: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  photo_url: string | null;
  social_links: any[];
  companies: any[];
  display_order: number;
  is_founder: boolean;
}

const ContactPage = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("team_members")
        .select("*")
        .order("display_order", { ascending: true });
      if (data) setMembers(data as unknown as TeamMember[]);
      setLoading(false);
    };
    fetch();
  }, []);

  const founder = members.find((m) => m.is_founder);
  const others = members.filter((m) => !m.is_founder);

  return (
    <div className="animate-fade-in">
      <div className="bg-card border-b border-border">
        <div className="container py-8">
          <h1 className="font-display text-3xl font-bold">Our Leadership</h1>
          <p className="text-muted-foreground mt-1">The people behind OldGold & Anish Enterprises</p>
        </div>
      </div>

      <div className="container py-10 max-w-5xl space-y-10">
        {loading && <p className="text-sm text-muted-foreground">Loading team...</p>}

        {/* ── FOUNDER CARD ── */}
        {founder && <FounderCard member={founder} />}

        {/* ── OTHER MEMBERS ── */}
        {others.length > 0 && (
          <div>
            <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" /> Executive Team
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {others.map((m) => (
                <MemberCard key={m.id} member={m} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   FOUNDER — premium, full-width card
   ═══════════════════════════════════════════ */
const FounderCard = ({ member }: { member: TeamMember }) => {
  const photo = member.photo_url || photoMap[member.name] || "";
  const socials = (member.social_links || []) as { icon: string; label: string; url: string }[];
  const companies = (member.companies || []) as { name: string; url: string }[];

  return (
    <div className="relative rounded-2xl border-2 border-primary bg-gradient-to-br from-primary/5 via-card to-primary/10 overflow-hidden shadow-lg">
      {/* Badge ribbon */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold shadow-md">
        <Crown className="h-3.5 w-3.5" /> SUPREME FOUNDER
      </div>

      <div className="md:flex">
        {/* Photo side */}
        <div className="md:w-1/3 flex flex-col items-center justify-center p-8 bg-foreground/5">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-primary via-primary/60 to-primary/20 blur-sm" />
            <img
              src={photo}
              alt={member.name}
              className="relative w-44 h-44 rounded-full object-cover border-4 border-primary"
            />
          </div>
          <h3 className="font-display text-2xl font-black mt-4 text-foreground">{member.name}</h3>
          <span className="text-primary font-display text-sm font-bold tracking-wider mt-1">
            {member.role_label}
          </span>
          <p className="text-muted-foreground text-xs text-center mt-2 leading-relaxed max-w-[220px]">
            {member.title}
          </p>
          <p className="text-primary/80 text-xs italic mt-3 text-center">
            "I don't follow the universe — I reprogram it."
          </p>
        </div>

        {/* Detail side */}
        <div className="md:w-2/3 p-6 space-y-5">
          {member.description && (
            <p className="text-sm text-foreground/80 leading-relaxed">{member.description}</p>
          )}

          {/* Companies */}
          {companies.length > 0 && (
            <div>
              <h4 className="font-display font-bold text-xs uppercase text-muted-foreground mb-2 tracking-wider flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" /> Anish Enterprises — Ventures
              </h4>
              <div className="flex flex-wrap gap-2">
                {companies.map((c) => (
                  <a
                    key={c.name}
                    href={c.url.startsWith("http") ? c.url : `https://${c.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" /> {c.name}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Emails */}
          <div>
            <h4 className="font-display font-bold text-xs uppercase text-muted-foreground mb-2 tracking-wider">Email</h4>
            {member.email && (
              <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                <Mail className="h-4 w-4 text-primary" /> {member.email}
              </a>
            )}
          </div>

          {/* Socials */}
          {socials.length > 0 && (
            <div>
              <h4 className="font-display font-bold text-xs uppercase text-muted-foreground mb-2 tracking-wider">Social & Platforms</h4>
              <div className="grid grid-cols-2 gap-1.5">
                {socials.map((s) => {
                  const Icon = iconMap[s.icon] || Globe;
                  return (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-secondary transition-colors group"
                    >
                      <Icon className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs group-hover:text-primary transition-colors">{s.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stars decoration */}
      <div className="absolute top-3 left-3 flex gap-0.5 opacity-30">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-3 w-3 text-primary fill-primary" />
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   MEMBER — compact card
   ═══════════════════════════════════════════ */
const MemberCard = ({ member }: { member: TeamMember }) => {
  const photo = member.photo_url || photoMap[member.name] || "";

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex flex-col items-center p-6 pb-4">
        <img
          src={photo}
          alt={member.name}
          className="w-24 h-24 rounded-full object-cover border-2 border-primary/40"
        />
        <h3 className="font-display text-lg font-bold mt-3 text-foreground">{member.name}</h3>
        <span className="text-primary text-xs font-bold tracking-wider">{member.role_label}</span>
        <p className="text-muted-foreground text-xs text-center mt-1">{member.title}</p>
      </div>

      <div className="px-5 pb-5 space-y-2">
        {member.description && (
          <p className="text-xs text-foreground/70 leading-relaxed">{member.description}</p>
        )}

        <div className="space-y-1 pt-2 border-t border-border">
          {member.email && (
            <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-xs hover:text-primary transition-colors">
              <Mail className="h-3.5 w-3.5 text-primary" /> {member.email}
            </a>
          )}
          {member.phone && (
            <a href={`tel:${member.phone}`} className="flex items-center gap-2 text-xs hover:text-primary transition-colors">
              <Phone className="h-3.5 w-3.5 text-primary" /> {member.phone}
            </a>
          )}
          {member.whatsapp && (
            <a
              href={`https://wa.me/${member.whatsapp.replace(/\s/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs hover:text-primary transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5 text-primary" /> WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
