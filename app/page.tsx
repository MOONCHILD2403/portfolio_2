import { ContactSection } from "@/components/contact-section";
import { CustomCursor } from "@/components/custom-cursor";
import { ExperienceSection } from "@/components/experience-section";
import { Hero } from "@/components/hero";
import { MultiStepLoader } from "@/components/multi-step-loader";
import { PlaygroundSection } from "@/components/playground-section";
import { ProjectsSection } from "@/components/projects-section";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SkillsSection } from "@/components/skills-section";
import { RaveParty } from "@/components/rave-party";

export default function HomePage() {
  return (
    <main className="page-shell">
      <CustomCursor />
      <MultiStepLoader />
      <SiteHeader />
      <Hero />
      <ExperienceSection />
      <ProjectsSection />
      <SkillsSection />
      <PlaygroundSection />
      <ContactSection />
      <RaveParty />
      <SiteFooter />
    </main>
  );
}
