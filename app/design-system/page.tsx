import {
  ArrowRight,
  Bell,
  Book,
  Calendar,
  ChartLine,
  Check,
  Clock,
  Palette,
  PencilLine,
  Play,
  Plus,
  Search,
  SlidersHorizontal,
  Star,
  Target,
  Timer,
  Trash2,
  Type,
} from "lucide-react";
import type { Metadata } from "next";

import { Hero } from "@/components/layout/hero";
import { PageContainer } from "@/components/layout/page-container";
import { Section } from "@/components/layout/section";
import { SiteFooter } from "@/components/layout/site-footer";
import { StickyNav } from "@/components/layout/sticky-nav";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Card,
  CardFooter,
  CardIconTile,
  CardText,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Field } from "@/components/ui/field";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Cols, Row, Stack } from "@/components/ui/layout-primitives";
import { Panel } from "@/components/ui/panel";
import { Progress } from "@/components/ui/progress";
import { SearchInput } from "@/components/ui/search-input";
import { SectionHeading } from "@/components/ui/section-heading";
import { SegmentedTabs, type SegmentedTabsItem } from "@/components/ui/segmented-tabs";
import { StatCard, StatGrid } from "@/components/ui/stat-card";
import { GradientText, SubLabel, TextLink } from "@/components/ui/typography";

import {
  IconCell,
  IconGrid,
  Swatch,
  SwatchGrid,
  Tile,
  TileRow,
  TypeRow,
} from "./_components/specimens";

export const metadata: Metadata = {
  title: "UI kit",
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "#colors", label: "Colors" },
  { href: "#type", label: "Typography" },
  { href: "#shape", label: "Radius & shadow" },
  { href: "#buttons", label: "Buttons" },
  { href: "#badges", label: "Badges" },
  { href: "#forms", label: "Forms" },
  { href: "#icons", label: "Icons" },
  { href: "#cards", label: "Cards" },
  { href: "#feedback", label: "States" },
  { href: "#tabs", label: "Segmented tabs" },
];

const BRAND = [
  { name: "Brand", token: "--color-brand", value: "#009CDC", className: "bg-brand" },
  { name: "Brand deep", token: "--color-brand-deep", value: "#008AC4", className: "bg-brand-deep" },
  { name: "Brand 50", token: "--color-brand-50", value: "#E8F4FD", className: "bg-brand-50" },
  { name: "Gradient", token: "--gradient-brand", value: "135deg", className: "gradient-brand" },
  { name: "Gradient hero", token: "--gradient-hero", value: "135deg", className: "gradient-hero" },
];

const SURFACES = [
  { name: "Canvas", token: "--color-canvas", value: "#F8FAFC", className: "bg-canvas" },
  { name: "Muted", token: "--color-slate-100", value: "#F1F5F9", className: "bg-slate-100" },
  { name: "Card", token: "--color-card", value: "#FFFFFF", className: "bg-card" },
  { name: "Border", token: "--color-line", value: "#E2E8F0", className: "bg-line" },
];

const INK = [
  { name: "Ink", token: "--color-ink", value: "#0F172A", className: "bg-ink" },
  { name: "Copy", token: "--color-copy", value: "#334155", className: "bg-copy" },
  { name: "Muted", token: "--color-muted", value: "#64748B", className: "bg-muted" },
  { name: "Slate 300", token: "--color-slate-300", value: "#CBD5E1", className: "bg-slate-300" },
];

const SEMANTIC = [
  { name: "Success", token: "--color-ok", value: "#22C55E", className: "bg-ok" },
  { name: "Warning", token: "--color-warn", value: "#F59E0B", className: "bg-warn" },
  { name: "Error", token: "--color-err", value: "#EF4444", className: "bg-err" },
  { name: "Star", token: "--color-star", value: "#FBBF24", className: "bg-star" },
];

const RADII = [
  { name: "sm", sub: "10px", className: "rounded-sm" },
  { name: "md", sub: "12px", className: "rounded-md" },
  { name: "lg", sub: "16px", className: "rounded-lg" },
  { name: "xl", sub: "20px", className: "rounded-xl" },
  { name: "full", sub: "pill", className: "rounded-full !w-[76px]" },
];

const SHADOWS = [
  { name: "soft", sub: "panels", className: "shadow-soft" },
  { name: "card", sub: "cards", className: "shadow-card" },
  { name: "lift", sub: "hover", className: "shadow-lift" },
  { name: "brand", sub: "primary button", className: "shadow-brand" },
];

const TAB_SPECIMEN_ITEMS: SegmentedTabsItem[] = [
  { value: "sim", label: "Simulation", icon: <Play aria-hidden />, selected: false, tabIndex: -1 },
  {
    value: "lab",
    label: "Sandbox",
    icon: <SlidersHorizontal aria-hidden />,
    selected: true,
    tabIndex: 0,
  },
  { value: "plan", label: "Plan", icon: <Target aria-hidden />, selected: false, tabIndex: -1 },
];

const ICONS = [
  { name: "book", icon: <Book /> },
  { name: "clock", icon: <Clock /> },
  { name: "target", icon: <Target /> },
  { name: "chart", icon: <ChartLine /> },
  { name: "bell", icon: <Bell /> },
  { name: "calendar", icon: <Calendar /> },
  { name: "check", icon: <Check /> },
  { name: "search", icon: <Search /> },
  { name: "edit", icon: <PencilLine /> },
  { name: "arrow", icon: <ArrowRight /> },
  { name: "timer", icon: <Timer /> },
  { name: "star", icon: <Star /> },
];

const DesignSystemPage = () => {
  return (
    <PageContainer>
      <Hero>
        <Eyebrow>Global Generation · Design system</Eyebrow>
        <h1 className="mt-5 mb-3 text-display-compact text-ink sm:text-display">
          UI kit <GradientText>SAT Portal</GradientText>
        </h1>
        <p className="max-w-[680px] text-lead">
          The shared visual language of Global Generation products: tokens, typography, components
          and states. Build in this style — the palette, bold headings, rounded blue buttons, soft
          shadows, air, line icons. No emoji, no purple, no other typefaces.
        </p>
        <Row className="mt-5.5">
          <Chip>
            <Type />
            Inter 400–800
          </Chip>
          <Chip>
            <Palette />
            Accent #009CDC
          </Chip>
          <Chip>
            <Check />
            Radius 10–20px
          </Chip>
        </Row>
      </Hero>

      <StickyNav items={NAV} aria-label="UI kit sections" />

      <Section id="colors">
        <SectionHeading
          num="01"
          title="Colors"
          description="Brand blue #009CDC and its gradient are the primary accent. No purple. Hex values come from the live tokens."
          level={1}
        />
        <SubLabel>Brand and gradients</SubLabel>
        <SwatchGrid>
          {BRAND.map((swatch) => (
            <Swatch key={swatch.name} {...swatch} />
          ))}
        </SwatchGrid>
        <SubLabel>Surfaces and borders</SubLabel>
        <SwatchGrid>
          {SURFACES.map((swatch) => (
            <Swatch key={swatch.name} {...swatch} />
          ))}
        </SwatchGrid>
        <SubLabel>Text and slate</SubLabel>
        <SwatchGrid>
          {INK.map((swatch) => (
            <Swatch key={swatch.name} {...swatch} />
          ))}
        </SwatchGrid>
        <SubLabel>Semantic</SubLabel>
        <SwatchGrid>
          {SEMANTIC.map((swatch) => (
            <Swatch key={swatch.name} {...swatch} />
          ))}
        </SwatchGrid>
      </Section>

      <Section id="type">
        <SectionHeading
          num="02"
          title="Typography"
          description="One typeface: Inter, self-hosted by next/font. Headings are 800, body is 400."
        />
        <Panel>
          <SubLabel>Weights</SubLabel>
          <Row className="gap-6.5">
            <span className="text-[19px] font-normal">Regular 400</span>
            <span className="text-[19px] font-medium">Medium 500</span>
            <span className="text-[19px] font-semibold">Semibold 600</span>
            <span className="text-[19px] font-bold">Bold 700</span>
            <span className="text-[19px] font-extrabold">Extrabold 800</span>
          </Row>
          <SubLabel>Scale</SubLabel>
          <TypeRow spec="text-display · 40/800">
            <span className="text-display text-ink">Page heading</span>
          </TypeRow>
          <TypeRow spec="text-title · 26/800">
            <span className="text-title text-ink">Section heading</span>
          </TypeRow>
          <TypeRow spec="text-lead · 18/400">
            <span className="text-lead">Lead paragraph, introductory text</span>
          </TypeRow>
          <TypeRow spec="text-body · 16/400">
            <span className="text-body">Body interface text</span>
          </TypeRow>
          <TypeRow spec="text-caption · 13/700">
            <span className="text-caption font-bold text-slate-600">Labels, field captions</span>
          </TypeRow>
          <TypeRow spec="text-eyebrow · 12.5/800">
            <span className="text-eyebrow text-brand-deep uppercase">Eyebrow / micro label</span>
          </TypeRow>
        </Panel>
      </Section>

      <Section id="shape">
        <SectionHeading
          num="03"
          title="Radius and shadows"
          description="Large soft corners and layered shadows — the glassy air of SAT Portal."
        />
        <Panel>
          <SubLabel>Radius</SubLabel>
          <TileRow>
            {RADII.map((tile) => (
              <Tile key={tile.name} {...tile} />
            ))}
          </TileRow>
          <SubLabel>Shadows</SubLabel>
          <TileRow>
            {SHADOWS.map((tile) => (
              <Tile key={tile.name} {...tile} shape="shadow" />
            ))}
          </TileRow>
        </Panel>
      </Section>

      <Section id="buttons">
        <SectionHeading
          num="04"
          title="Buttons"
          description="Primary is the blue gradient with its glow. 16px radius, 17px line icons, hover lifts."
        />
        <Panel>
          <SubLabel>Variants</SubLabel>
          <Row>
            <Button>
              <ArrowRight />
              Get started
            </Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">
              <Trash2 />
              Delete
            </Button>
          </Row>
          <SubLabel>Sizes and icons</SubLabel>
          <Row>
            <Button size="sm">Small</Button>
            <Button>Base</Button>
            <Button size="lg">Large</Button>
            <Button variant="outline" size="icon" aria-label="Add item">
              <Plus />
            </Button>
          </Row>
          <SubLabel>States</SubLabel>
          <Row>
            <Button loading>Saving</Button>
            <Button disabled>Disabled</Button>
            <Button variant="outline" disabled>
              Disabled outline
            </Button>
          </Row>
        </Panel>
      </Section>

      <Section id="badges">
        <SectionHeading
          num="05"
          title="Badges and pills"
          description="Brand and semantic fills with transparency. The shape is a pill."
        />
        <Panel>
          <SubLabel>Statuses</SubLabel>
          <Row>
            <Badge tone="blue" dot>
              In progress
            </Badge>
            <Badge tone="green" dot>
              Passed
            </Badge>
            <Badge tone="amber" dot>
              Needs review
            </Badge>
            <Badge tone="red" dot>
              Error
            </Badge>
            <Badge>Draft</Badge>
          </Row>
          <SubLabel>With icons and eyebrow</SubLabel>
          <Row>
            <Badge tone="blue">
              <Check />
              Verified
            </Badge>
            <Badge tone="amber">
              <Star fill="currentColor" stroke="none" />
              760 points
            </Badge>
            <Badge tone="outline">SAT Reading</Badge>
            <Eyebrow size="sm">New module</Eyebrow>
          </Row>
        </Panel>
      </Section>

      <Section id="forms">
        <SectionHeading
          num="06"
          title="Fields and forms"
          description="On focus: a blue border and a soft ring. 12px radius."
        />
        <Panel>
          <Cols>
            <div>
              <Field htmlFor="ds-name" label="Name">
                <Input id="ds-name" placeholder="What's your name" />
              </Field>
              <Field htmlFor="ds-section" label="SAT section">
                <Select id="ds-section" defaultValue="rw">
                  <option value="rw">Reading &amp; Writing</option>
                  <option value="math">Math</option>
                </Select>
              </Field>
              <Field htmlFor="ds-note" label="Note" hint="Optional.">
                <Textarea id="ds-note" rows={3} placeholder="What to work on" />
              </Field>
              <Field htmlFor="ds-goal" label="Goal score" error="Enter a score between 400 and 1600.">
                <Input id="ds-goal" aria-invalid defaultValue="2400" />
              </Field>
            </div>
            <div>
              <Field htmlFor="ds-search" label="Search">
                <SearchInput id="ds-search" placeholder="Search topics" />
              </Field>
              <fieldset className="mb-4.5">
                <legend className="mb-[7px] block text-caption font-bold text-slate-600">
                  Mark what you have covered
                </legend>
                <Checkbox name="topics" value="linear" label="Linear equations" defaultChecked />
                <Checkbox name="topics" value="percent" label="Percentages and ratios" />
                <Checkbox name="topics" value="distractors" label="Distractor analysis" />
                <Checkbox name="topics" value="locked" label="Locked topic" disabled />
              </fieldset>
            </div>
          </Cols>
        </Panel>
      </Section>

      <Section id="icons">
        <SectionHeading
          num="07"
          title="Icons"
          description="Line icons only (lucide): stroke 2, round caps, currentColor. No emoji."
        />
        <Panel>
          <IconGrid>
            {ICONS.map((entry) => (
              <IconCell key={entry.name} name={entry.name}>
                {entry.icon}
              </IconCell>
            ))}
          </IconGrid>
        </Panel>
      </Section>

      <Section id="cards">
        <SectionHeading
          num="08"
          title="Cards"
          description="A content card (a SAT Portal module) and metrics. Hover lifts and deepens the shadow."
        />
        <SubLabel>Content cards</SubLabel>
        <Cols>
          <Card interactive>
            <CardIconTile>
              <Target />
            </CardIconTile>
            <CardTitle>Goal tracker</CardTitle>
            <CardText>
              Enter a target score and an exam date, then see whether you are on track and what to
              fix first.
            </CardText>
            <CardFooter>
              <Badge tone="blue">Analytics</Badge>
              <ButtonLink href="#cards" variant="secondary" size="sm">
                Open
                <ArrowRight />
              </ButtonLink>
            </CardFooter>
          </Card>
          <Card interactive>
            <CardIconTile>
              <Timer />
            </CardIconTile>
            <CardTitle>Timing trainer</CardTitle>
            <CardText>
              Teaches you to hold a section&apos;s pace and highlights where you stall and lose
              minutes.
            </CardText>
            <CardFooter>
              <Badge tone="green">Practice</Badge>
              <ButtonLink href="#cards" variant="secondary" size="sm">
                Open
                <ArrowRight />
              </ButtonLink>
            </CardFooter>
          </Card>
        </Cols>
        <SubLabel>Metrics</SubLabel>
        <StatGrid>
          <StatCard value="1340" label="Current score" />
          <StatCard value="+120" label="Growth this month" />
          <StatCard value="18" label="Days to goal" />
          <StatCard value="84%" label="Readiness" />
        </StatGrid>
      </Section>

      <Section id="feedback">
        <SectionHeading
          num="09"
          title="States"
          description="Hints, progress and empty states."
        />
        <Panel>
          <Cols>
            <div>
              <SubLabel>Alerts</SubLabel>
              <Stack>
                <Alert tone="info" live="off">
                  Tip: start with the section where you lose the most points.
                </Alert>
                <Alert tone="ok" live="off">
                  Module complete. Keep it up.
                </Alert>
                <Alert tone="warn" live="off">
                  Your pace is behind the target for this section.
                </Alert>
                <Alert tone="err" live="off">
                  Could not save your answer. Please try again.
                </Alert>
              </Stack>
            </div>
            <div>
              <SubLabel>Progress</SubLabel>
              <div className="mb-2 text-caption text-muted">Exam readiness — 84%</div>
              <Progress value={84} label="Exam readiness" />
              <SubLabel>Empty state</SubLabel>
              <EmptyState action={<Button size="sm">Start a module</Button>}>
                No activity yet. Start your first module.
              </EmptyState>
            </div>
          </Cols>
        </Panel>
      </Section>

      <Section id="tabs">
        <SectionHeading
          num="10"
          title="Segmented tabs"
          description="Roving-tabindex tab bar. Keyboard behaviour lives in the composing component, not here — this is a static specimen."
        />
        <Panel>
          <SubLabel>Default</SubLabel>
          <SegmentedTabs aria-label="Demo tabs" items={TAB_SPECIMEN_ITEMS} />
        </Panel>
      </Section>

      <SiteFooter>
        <strong>Global Generation</strong> · SAT Portal UI kit. Reference:{" "}
        <TextLink href="https://sat.global-generations-edu.com/" external>
          sat.global-generations-edu.com
        </TextLink>
        .
      </SiteFooter>
    </PageContainer>
  );
};

export default DesignSystemPage;
