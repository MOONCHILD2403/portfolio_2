import { MotionSection } from "@/components/motion-section";
import { SectionHeader } from "@/components/section-header";
import { TimelineBeam } from "@/components/timeline-beam";

export function ExperienceSection() {
  return (
    <MotionSection className="section-shell" id="experience">
      <SectionHeader
        kicker="Experience"
        title="Recent work in backend systems and delivery."
        copy="Roles across product and platform work, centered on APIs, authentication, migration safety, automation, and infrastructure choices that stay maintainable."
      />

      <TimelineBeam />
    </MotionSection>
  );
}
