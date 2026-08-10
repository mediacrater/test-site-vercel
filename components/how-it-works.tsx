import { Download, Upload, Settings, CheckCircle } from "lucide-react"

const steps = [
  {
    step: "01",
    title: "Install Extension",
    description: "Add the Mediacrater Chrome extension with one click. Verify your email to start.",
  },
  {
    step: "02",
    title: "Upload Your Ad",
    description: "Drag and drop your video or image file. We support all common formats up to 120 seconds.",
  },
  {
    step: "03",
    title: "Configure Scan",
    description: "Select your target platforms and scan depth based on your campaign needs.",
  },
  {
    step: "04",
    title: "Get Results",
    description: "Review your confidence report, apply recommended fixes, and upload with certainty.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 border-b border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Simple Process</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground font-[family-name:var(--font-display)]">
            Get Started in 60 Seconds
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            From installation to your first compliance report in under a minute.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item) => (
            <div key={item.step} className="p-6 rounded-xl bg-card border border-border flex flex-col justify-between">
              <div>
                <span className="text-3xl font-extrabold text-primary/40 font-mono mb-4 block">
                  {item.step}
                </span>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
