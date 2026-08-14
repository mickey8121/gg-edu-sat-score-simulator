import { cn } from "@/lib/utils";

export type SwatchProps = {
  name: string;
  token: string;
  value: string;
  className: string;
};

export type SwatchGridProps = React.ComponentProps<"div">;

export type TypeRowProps = {
  spec: string;
  children: React.ReactNode;
};

export type TileProps = {
  name: string;
  sub: string;
  className: string;
  shape?: "radius" | "shadow";
};

export type TileRowProps = React.ComponentProps<"div">;

export type IconCellProps = {
  name: string;
  children: React.ReactNode;
};

export type IconGridProps = React.ComponentProps<"div">;

export const Swatch = ({ name, token, value, className }: SwatchProps) => {
  return (
    <div className="overflow-hidden rounded-md border border-line bg-card">
      <div className={cn("h-[72px] border-b border-line", className)} />
      <div className="px-[13px] pt-[11px] pb-[13px]">
        <div className="text-caption font-bold text-ink">{name}</div>
        <div className="mt-[3px] font-mono text-micro text-muted">{token}</div>
        <div className="mt-0.5 font-mono text-micro text-slate-400 uppercase">{value}</div>
      </div>
    </div>
  );
};

export const SwatchGrid = ({ className, ...props }: SwatchGridProps) => {
  return (
    <div
      className={cn(
        "grid gap-3.5 [grid-template-columns:repeat(auto-fill,minmax(168px,1fr))]",
        className,
      )}
      {...props}
    />
  );
};

export const TypeRow = ({ spec, children }: TypeRowProps) => {
  return (
    <div className="flex items-baseline gap-5 border-b border-line py-3 last:border-b-0">
      <span className="w-40 shrink-0 font-mono text-micro text-slate-400">{spec}</span>
      <span>{children}</span>
    </div>
  );
};

export const Tile = ({ name, sub, className, shape = "radius" }: TileProps) => {
  return (
    <div className="text-center">
      <div
        className={cn(
          shape === "radius"
            ? "mx-auto mb-2 h-[76px] w-[104px] border border-line bg-slate-50"
            : "mx-auto mb-2.5 h-20 w-[120px] rounded-md bg-card",
          className,
        )}
      />
      <div className="text-caption font-bold text-ink">{name}</div>
      <div className="font-mono text-micro text-slate-400">{sub}</div>
    </div>
  );
};

export const TileRow = ({ className, ...props }: TileRowProps) => {
  return <div className={cn("flex flex-wrap gap-[22px]", className)} {...props} />;
};

export const IconCell = ({ name, children }: IconCellProps) => {
  return (
    <div className="flex flex-col items-center gap-2.5 rounded-md border border-line bg-card px-2 py-4 text-slate-700">
      <span className="[&>svg]:size-6">{children}</span>
      <span className="text-micro text-slate-400">{name}</span>
    </div>
  );
};

export const IconGrid = ({ className, ...props }: IconGridProps) => {
  return (
    <div
      className={cn(
        "grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(92px,1fr))]",
        className,
      )}
      {...props}
    />
  );
};
