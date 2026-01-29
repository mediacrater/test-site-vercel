import { Download, Upload, Settings, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: Download,
    step: "01",
    title: "Install Extension",
    description: "Add the Mediacrater Chrome extension with one click. No account required to start.",
  },
  {
    icon: Upload,
    step: "02",
    title: "Upload Your Ad",
    description: "Drag and drop your video file. We support all common formats up to 300 seconds.",
  },
  {
    icon: Settings,
    step: "03",
    title: "Configure Scan",
    description: "Select your target platforms and scan depth based on your campaign needs.",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Get Results",
    description: "Review your confidence report, apply recommended fixes, and upload with certainty.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground font-[family-name:var(--font-display)] text-balance">
            Get Started in 60 Seconds
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            From installation to your first compliance report in under a minute.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, index) => (
            <div key={item.step} className="relative">
              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-border" />
              )}

              <div className="text-center">
                {/* Step number */}
                <div className="relative inline-flex">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <item.icon className="w-10 h-10 text-primary" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-accent text-foreground text-sm font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3 font-[family-name:var(--font-display)]">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
