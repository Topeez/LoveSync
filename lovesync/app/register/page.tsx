import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { SignUpForm } from "@/components/auth/sign-up-form";
import Image from "next/image";
import GoogleLogin from "@/components/auth/google-login";

const SignUp = () => (
    <div className="flex justify-center items-center sm:bg-foreground/5 h-screen">
        <div className="sm:bg-card mx-auto px-10 py-14 sm:border sm:rounded-2xl w-full max-w-md">
            <Image
                src={"/android-chrome-512x512.png"}
                width={200}
                height={200}
                alt="app logo"
                className="mx-auto size-9"
            />
            <h1 className="mt-3 font-medium text-2xl text-center tracking-[-0.015em]">
                Zaregistrujte se do LoveSync zdarma
            </h1>

            <div className="mt-10">
                <SignUpForm />
                <div className="flex justify-center items-center gap-2 my-6 overflow-hidden">
                    <Separator />
                    <span className="text-muted-foreground text-sm">NEBO</span>
                    <Separator />
                </div>

                <div className="flex sm:flex-row flex-col items-center gap-2">
                    <GoogleLogin>
                        Pokračovat pomocí{" "}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            width="100"
                            height="100"
                            viewBox="0,0,256,256"
                        >
                            <g
                                fill="#ffffff"
                                fillRule="nonzero"
                                stroke="none"
                                strokeWidth="1"
                                strokeLinecap="butt"
                                strokeLinejoin="miter"
                                strokeMiterlimit="10"
                                strokeDasharray=""
                                strokeDashoffset="0"
                                fontFamily="none"
                                fontWeight="none"
                                fontSize="none"
                            >
                                <g transform="scale(8.53333,8.53333)">
                                    <path d="M15.00391,3c-6.629,0 -12.00391,5.373 -12.00391,12c0,6.627 5.37491,12 12.00391,12c10.01,0 12.26517,-9.293 11.32617,-14h-1.33008h-2.26758h-7.73242v4h7.73828c-0.88958,3.44825 -4.01233,6 -7.73828,6c-4.418,0 -8,-3.582 -8,-8c0,-4.418 3.582,-8 8,-8c2.009,0 3.83914,0.74575 5.24414,1.96875l2.8418,-2.83984c-2.134,-1.944 -4.96903,-3.12891 -8.08203,-3.12891z"></path>
                                </g>
                            </g>
                        </svg>
                    </GoogleLogin>
                </div>
            </div>

            <p className="mt-6 text-muted-foreground text-sm text-center">
                Máte již účet?{" "}
                <Link className="text-foreground" href="/login">
                    Přihlásit se
                </Link>
            </p>
        </div>
    </div>
);

export default SignUp;
