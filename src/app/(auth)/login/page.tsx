import { LoginForm } from './login-form'

export default async function Login() {
  return (
    <div className="w-full grid min-h-[100vh] lg:grid-cols-2 p-2">
      <div className="hidden lg:block">
        <div className="relative hidden h-full flex-col p-10 text-white lg:flex rounded-[2px]">
          <div className="relative z-20 flex items-center text-lg font-medium">
            <h1 className="text-2xl font-bold">Mana</h1>
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;This platform has streamlined my workflow and made it so much easier to
                manage tasks. I&apos;m getting projects done faster and with way less stress.&rdquo;
              </p>
              <footer className="text-sm">Carlos Bensant</footer>
            </blockquote>
          </div>
        </div>
      </div>
      <div className="border rounded-[2px]">
        <div className="h-full flex items-center justify-center py-24">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
