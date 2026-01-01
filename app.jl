using Pkg
Pkg.activate(".")

using Oxygen
staticfiles("./static", "/")
serve()