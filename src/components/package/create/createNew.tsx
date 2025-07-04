/* eslint-disable prettier/prettier */
'use client';

import LoadingSkeleton from '@/components/ui/Loading/LoadingSkeleton';
import {
  useAddPackagesV2Mutation,
  useGetAllPackagesV2Query,
  useUpdatePackagesV2Mutation,
} from '@/redux/api/public/packageV2';
import { MinusCircleOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Switch,
  message,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect } from 'react';

const { Option } = Select;

export default function AdminPackageForm() {
  const [form] = useForm();
  const { data, isLoading } = useGetAllPackagesV2Query({ status: 'active' });
  const apiData = data?.data || [];

  const [addPackagesV2] = useAddPackagesV2Mutation();
  const [updatePackagesV2] = useUpdatePackagesV2Mutation();

  // ✅ Fill form and trigger Form.List UI correctly
  useEffect(() => {
    if (apiData?.length) {
      const enriched = apiData.map((pkg) => ({
        ...pkg,
        plans: pkg.plans.map((p: any) => ({
          planId: p.planId || crypto.randomUUID(),
          ...p,
        })),
      }));

      form.setFieldsValue({ packages: enriched });

      // ✅ Ensure Form.List UI is triggered
      const currentFields = form.getFieldValue('packages');
      if (!currentFields || currentFields.length === 0) {
        enriched.forEach((item, index) => {
          form.setFieldValue(['packages', index, 'grade'], item.grade);
        });
      }
    }
  }, [apiData, form]);

  const onFinish = async (values: any) => {
    const incoming = values.packages;

    try {
      if (apiData?.length) {
        for (let i = 0; i < incoming.length; i++) {
          const existing = apiData[i];
          if (existing?._id) {
            await updatePackagesV2({
              id: existing._id,
              data: {
                ...incoming[i],
                status: incoming[i].status ? 'active' : 'inactive',
              },
            }).unwrap();
          }
        }
        message.success('✅ Packages updated successfully');
      } else {
        await addPackagesV2({
          packages: { ...incoming, status: incoming.status ? 'active' : 'inactive' },
        }).unwrap();
        message.success('✅ Packages created successfully');
      }
    } catch (error: any) {
      message.error(error?.data?.message || 'Something went wrong');
    }
  };

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="p-4 max-w-6xl mx-auto text-sm">
      <Form form={form} layout="vertical" onFinish={onFinish} className="space-y-4">
        <Form.List name="packages">
          {(fields, { add, remove }) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map(({ key, name, ...restField }) => (
                <Card
                  key={key}
                  size="small"
                  title={
                    <span className="text-base font-semibold">🎓 Package {key + 1}</span>
                  }
                  styles={{ header: { padding: '8px 12px' }, body: { padding: 12 } }}
                  extra={
                    <Button
                      danger
                      type="link"
                      onClick={() =>
                        Modal.confirm({
                          title: 'Are you sure?',
                          content: 'Do you want to remove this package?',
                          okText: 'Yes',
                          cancelText: 'Cancel',
                          onOk: () => remove(name),
                        })
                      }
                    >
                      ❌ Remove
                    </Button>
                  }
                >
                  <Form.Item
                    {...restField}
                    name={[name, 'grade']}
                    label="Grade Key"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="e.g. 6-12" size="small" className="text-sm" />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'label']}
                    label="Grade Label"
                    rules={[{ required: true }]}
                  >
                    <Input
                      placeholder="e.g. 6–12th Grade"
                      size="small"
                      className="text-sm"
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'badge']}
                    label="Badge"
                    rules={[{ required: true }]}
                  >
                    <Input
                      placeholder="e.g. Middle/High School"
                      size="small"
                      className="text-sm"
                    />
                  </Form.Item>

                  <Form.List name={[name, 'plans']}>
                    {(planFields, { add: addPlan, remove: removePlan }) => (
                      <>
                        {planFields.map(
                          ({ key: planKey, name: planName, ...planRest }) => (
                            <Card
                              key={planKey}
                              type="inner"
                              size="small"
                              title={
                                <span className="text-sm font-semibold">
                                  Plan {planKey + 1}
                                </span>
                              }
                              styles={{
                                header: { padding: '6px 10px' },
                                body: { padding: 10 },
                              }}
                              style={{ marginBottom: 8 }}
                              extra={
                                <MinusCircleOutlined
                                  onClick={() => removePlan(planName)}
                                  style={{ color: 'red' }}
                                />
                              }
                            >
                              <Form.Item name={[planName, '_id']} hidden>
                                <Input />
                              </Form.Item>

                              <Form.Item
                                {...planRest}
                                name={[planName, 'type']}
                                label="Plan Type"
                                rules={[{ required: true }]}
                              >
                                <Select
                                  placeholder="Select type"
                                  size="small"
                                  className="text-sm"
                                >
                                  <Option value="Subscription">Subscription</Option>
                                  <Option value="One Year">One Year</Option>
                                  <Option value="Lifetime">Lifetime</Option>
                                </Select>
                              </Form.Item>

                              <Form.Item
                                {...planRest}
                                name={[planName, 'amount']}
                                label="Price (Amount)"
                                rules={[{ required: true }]}
                              >
                                <InputNumber
                                  className="w-full text-sm"
                                  placeholder="e.g. 85"
                                  min={0}
                                  size="small"
                                />
                              </Form.Item>

                              <Form.Item
                                {...planRest}
                                name={[planName, 'billing']}
                                label="Billing Type"
                                rules={[{ required: true }]}
                              >
                                <Select
                                  placeholder="Select billing"
                                  size="small"
                                  className="text-sm"
                                >
                                  <Option value="monthly">Monthly</Option>
                                  <Option value="yearly">Yearly</Option>
                                  <Option value="lifetime">Lifetime</Option>
                                </Select>
                              </Form.Item>

                              <Form.Item
                                {...planRest}
                                name={[planName, 'note']}
                                label="Note"
                              >
                                <Input
                                  placeholder="e.g. 50% off"
                                  size="small"
                                  className="text-sm"
                                />
                              </Form.Item>

                              <Form.Item
                                {...planRest}
                                name={[planName, 'email']}
                                label="Email (if any)"
                              >
                                <Input
                                  placeholder="Email address"
                                  size="small"
                                  className="text-sm"
                                />
                              </Form.Item>

                              <Form.Item
                                {...planRest}
                                name={[planName, 'status']}
                                label="Status"
                                valuePropName="checked"
                              >
                                <Switch
                                  checkedChildren="Active"
                                  unCheckedChildren="Deactive"
                                  size="small"
                                />
                              </Form.Item>
                            </Card>
                          ),
                        )}
                      </>
                    )}
                  </Form.List>
                </Card>
              ))}
            </div>
          )}
        </Form.List>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="mt-6 w-full text-sm">
            ✅ Save Packages
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
