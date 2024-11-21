'use client';

import { Input } from '@/components/ui/input';
import { useFormik } from 'formik';
import { useMutation } from '@tanstack/react-query';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/common/Spinner';
import InputWrapper from '@/components/ui/input-wrapper';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import Submit from '@/components/button/Submit';
import { RiSendPlaneLine } from 'react-icons/ri';
import Link from 'next/link';
import crypto from '@/utils/crypto';
import user from '@/utils/user';

// Yup validation schema
const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function SignupPage() {
    const router = useRouter();

    const initialValues = {
        name: 'abid',
        email: 'abid@mail.com',
        password: 'Password@1234'
    };

    const submit = async (data) => {
        await user.signup(data);
    };
    
    const onSuccess = () => {
        formik.resetForm();
        // router.push('/')
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const encryptedPassword = crypto.encrypt(values.password);
            mutation.mutate({ ...values, password: encryptedPassword });
        },
    });

    const mutation = useMutation({
        mutationKey: ['signup'],
        mutationFn: submit,
        onSuccess,
    });

    return (
        <Card className='max-w-sm w-full'>
            <CardHeader className="text-center">
                <h2 className="text-lg md:text-xl lg:text-3xl uppercase font-semibold">Login</h2>
                <p className="text-sm text-gray-500 mt-1">Please enter your credentials to access your account</p>
            </CardHeader>
            <CardContent>
                <form onSubmit={formik.handleSubmit} className="flex flex-col items-center justify-center space-y-4 w-full">

                    <InputWrapper label="name" error={formik.errors?.name} touched={formik.touched?.name}>
                        <Input
                            name="name"
                            placeholder="name"
                            value={formik.values?.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </InputWrapper>

                    <InputWrapper label="Email" error={formik.errors?.email} touched={formik.touched?.email}>
                        <Input
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={formik.values?.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </InputWrapper>

                    <InputWrapper label="Password" error={formik.errors?.password} touched={formik.touched?.password}>
                        <Input
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={formik.values?.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </InputWrapper>

                    <div>
                        <Submit
                            disabled={mutation.isPending || mutation.isSuccess}
                            label={mutation.isPending ? 'Submitting...' : 'Signup'} // Dynamic label
                            icon={mutation.isPending ? <Spinner size="4" /> : <RiSendPlaneLine />} // Dynamic icon
                        />
                    </div>
                </form>
            </CardContent>
            <CardFooter>
                <div className='flex flex-col space-y-2'>
                    <Link href={'login'} className='hover:underline hover:text-primary'>Have an account?</Link>
                </div>
            </CardFooter>
        </Card>
    )
}
