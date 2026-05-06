import { cn } from "@/lib/utils";
import * as React from "react";

export interface SteeringCommitteeMember {
  name: string;
  role?: string;
  focus?: string;
  cadence?: string;
}

export interface LandingProductExecutiveSteeringCommitteeProps
  extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  members: SteeringCommitteeMember[];
}

export const LandingProductExecutiveSteeringCommittee = React.forwardRef<
  HTMLElement,
  LandingProductExecutiveSteeringCommitteeProps
>(({ className, title = "Make the steering committee feel staffed and intentional", description, members, ...props }, ref) => {
  return (
    <section ref={ref} className={cn("w-full py-12 lg:py-16", className)} {...props}>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
          {description ? <p className="max-w-2xl text-base text-muted-foreground md:text-lg">{description}</p> : null}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {members.map((member) => (
            <article key={member.name} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold tracking-tight">{member.name}</h3>
              {member.role ? <div className="mt-2 text-sm text-muted-foreground">{member.role}</div> : null}
              {member.focus ? <div className="mt-3 text-sm font-medium text-foreground">{member.focus}</div> : null}
              {member.cadence ? <div className="mt-4 text-sm text-muted-foreground">Cadence: {member.cadence}</div> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

LandingProductExecutiveSteeringCommittee.displayName = "LandingProductExecutiveSteeringCommittee";