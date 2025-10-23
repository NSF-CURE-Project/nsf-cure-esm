import { ThemedButton } from "../components/ui/ThemedButton";

export default function Landing() {
  return (
    <div className="mx-auto max-w-[60rem] px-6">
      <header>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          NSF CURE Engineering Supplemental Materials
        </h1>

        <p className="mt-3 text-muted-foreground">
          Welcome to NSF CURE Engineering Supplemental Materials, a platform designed to make complex engineering topics easier to learn and teach.
          Browse interactive lessons, project examples, and resources developed through the NSF-funded CURE initiative at Cal Poly Pomona.
        </p>
      </header>

      <section className="mt-8" aria-labelledby="getting-started">
        {/* TOC anchor */}
        <h2 id="getting-started" className="sr-only">
          Getting Started
        </h2>

        <ThemedButton href="/materials">Getting Started</ThemedButton>
      </section>

      <section className="mt-10" aria-labelledby="about">
        {/* TOC anchor */}
        <h2 id="about" className="sr-only">
          About
        </h2>

        {/* Themed card; aligns with the same container */}
        <article className="bg-card text-card-foreground rounded-xl p-6 shadow-sm">
          <div className="space-y-4 leading-7">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis enim odio, tempor quis consequat at, sagittis nec risus. Sed quis felis
              pellentesque, commodo dui ac, elementum erat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
              Etiam pharetra est ac lorem molestie, id luctus mauris egestas. Cras mattis mi tellus, sed venenatis velit facilisis vitae. Nulla
              scelerisque bibendum felis. Proin bibendum urna eu lacinia fermentum. In id magna in neque consequat auctor sed quis nulla. Donec
              massa orci, iaculis vel nisl a, sollicitudin tempor neque. Praesent et risus ac quam tempor porta vitae a massa. Quisque vel augue ante.
            </p>

            <p className="text-muted-foreground">
              Curabitur eget odio finibus, vestibulum turpis at, euismod dui. Pellentesque et turpis eget ante hendrerit faucibus. Nulla at maximus dui.
              Maecenas at ipsum eget odio blandit vestibulum eget nec eros. Suspendisse faucibus efficitur lacus sit amet laoreet. Cras ullamcorper nibh
              nec ex commodo venenatis. Cras rhoncus nulla augue, nec porttitor diam lobortis sed. Nullam suscipit non quam sed congue. Cras accumsan
              augue eu quam iaculis, sagittis viverra urna tempus. In vestibulum faucibus nisi. Suspendisse potenti. In aliquet turpis ac ligula suscipit
              condimentum. Duis et erat quis sem imperdiet vulputate. Curabitur lacinia quis ipsum vel ullamcorper. Curabitur vitae libero sed dui
              malesuada eleifend.
            </p>

            <p>
              Fusce a semper metus. Quisque facilisis eros nec ligula luctus, vitae semper lectus aliquet. Duis nec tristique libero. In tincidunt,
              metus eu efficitur maximus, lacus nunc dapibus est, nec tincidunt lorem velit eu neque. Suspendisse sed augue commodo, pellentesque diam
              et, varius enim. Donec nisi tellus, dignissim et sapien a, tempus laoreet erat. Quisque congue id est at consectetur.
            </p>

            <p className="text-muted-foreground">
              Fusce non rutrum dui. Vivamus vitae mattis sem, vel dictum magna. Integer tellus diam, luctus in tellus vel, viverra cursus turpis. In hac
              habitasse platea dictumst. Ut ullamcorper dapibus nulla, sed egestas ipsum tristique quis. Mauris et pulvinar elit, in egestas massa. Duis
              sodales augue et condimentum interdum. Donec eleifend nunc at tellus hendrerit, porta condimentum dui tempus. Sed quis feugiat est.
              Praesent vel finibus erat.
            </p>

            <p>
              Integer efficitur metus eget tincidunt consectetur. Nam eu diam sagittis, elementum eros non, posuere risus. Orci varius natoque penatibus
              et magnis dis parturient montes, nascetur ridiculus mus. Morbi dui tortor, ultricies eu nisi quis, consequat iaculis odio. Duis interdum
              velit sollicitudin enim congue, eget lobortis ante gravida. Donec vitae mollis est. Etiam aliquam tempor pharetra. Phasellus faucibus nunc
              et placerat laoreet. Cras laoreet, magna eget placerat venenatis, ligula dolor bibendum justo, at fermentum dolor quam sit amet leo.
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}
