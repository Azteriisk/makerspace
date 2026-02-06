export function BackgroundGrid() {
    return (
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#0086e41a_1px,transparent_1px),linear-gradient(to_bottom,#0086e41a_1px,transparent_1px)] bg-[size:40px_40px]">
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[400px] w-[400px] rounded-full bg-primary/20 opacity-30 blur-[100px]" />
        </div>
    )
}
