/* eslint-disable react/no-unescaped-entities */
'use client';
import { Form, message } from 'antd';
import Link from 'next/link';
import ModalComponent from '../Modal/ModalComponents';
import Logo from '../shared/Logo';
import EmailCollect from '../widgets/emailCollect';
const Footer = () => {
  const footerNavs = [
    {
      label: 'Company',
      items: [
        {
          // href: '/',
          name: 'F&Q',
        },
        {
          // href: '/',
          name: 'Partners',
        },
        {
          // href: '/',
          name: 'Team',
        },
        {
          // href: '/',
          name: 'Careers',
        },
      ],
    },
    {
      label: 'Resources',
      items: [
        {
          href: '/contact',
          name: 'Contact',
        },
        {
          // href: '/',
          name: 'Support',
        },
        {
          // href: '/',
          name: 'Docs',
        },
        {
          // href: '/',
          name: 'Pricing',
        },
      ],
    },
    {
      label: 'About',
      items: [
        {
          // href: '/',
          name: 'Terms',
        },
        {
          // href: '/',
          name: 'License',
        },
        {
          // href: '/',
          name: 'Privacy',
        },
        {
          href: '/aboutUs',
          name: 'About us',
        },
      ],
    },
  ];

  const [form] = Form.useForm();

  const OnSubmit = (values: any) => {
    message.success('successfully subscribe');
    form.resetFields();
  };

  return (
    <>
      <div className="mt-5 bg-slate-200 px-6 py-6">
        <div className="container mx-auto">
          <div className="sm:grid-col-2 grid gap-10 md:grid-cols-5">
            <div className="col-span-2">
              {/* <Logo /> */}
              <p className="px-4 py-6 text-lg">
                iBLossomLearn facilitates individualized instruction. By providing a
                comprehensive K–12 curriculum, personalized support, and up-to-date
                analytics, iBLossomLearn effectively responds to the exclusive demands
                of every learner.
              </p>
            </div>
            {footerNavs.map((item, idx) => (
              <ul className="list-none space-y-4" key={idx}>
                <h4 className="font-bold text-gray-800">{item.label}</h4>
                {item.items.map((el, idx) => (
                  <li key={idx}>
                    {el.href ? (
                      <Link
                        href={el.href}
                        className="hover:text-indigo-600 hover:underline"
                      >
                        {el.name}
                      </Link>
                    ) : (
                      <p
                        // href={el.href}
                        className="hover:text-indigo-600 hover:underline"
                      >
                        {el.name}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ))}
          </div>
          <div>
            <div className="py-4">
              <h2 className="text-lg font-bold">Newsletter</h2>
              <ModalComponent
                button={
                  <button className="rounded-md bg-[#2a63ff] p-2.5 text-white shadow-md outline-none focus:shadow-none sm:px-5">
                    Subscribe
                  </button>
                }
                width={500}
              >
                <div
                  data-aos="fade-left"
                  className="grid-cols-1 text-center bg-[#5373fe] rounded-lg p-2"
                >
                  <h2 className="text-3xl font-bold my-6 text-white">
                    Submit Your Email
                  </h2>
                  <EmailCollect />
                </div>
              </ModalComponent>
            </div>
            <div className="flex justify-between">
              <div>© iBLossomLearn All Rights Reserved</div>
              <div className="flex gap-5">
                {/* <div>Follow Us</div>
                <div>twitter logo</div>
                <div>logo</div>
                <div>logo</div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="grid grid-cols-1 lg:grid-cols-2">
        <div></div>
        <div>
          <h1>Keep In Touch</h1>
          <Form className="flex flex-col gap-4" onFinish={OnSubmit} form={form}>
            <Form.Item name="">
              <Input
                type="text"
                placeholder="Enter your name"
                className="w-full p-2.5 outline-none"
                required
              />
            </Form.Item>
            <Form.Item name="">
              <Input
                type=""
                placeholder="Enter your name"
                className="w-full p-2.5 outline-none"
                required
              />
            </Form.Item>
          </Form>
        </div>
      </div> */}
    </>
  );
};

export default Footer;
