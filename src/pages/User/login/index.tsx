import {
  AlipayCircleOutlined,
  LockOutlined,
  MailOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import { Alert, Space, message, Tabs } from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormCaptcha, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { useIntl, connect, FormattedMessage } from 'umi';
import type { Dispatch } from 'umi';
import type { StateType } from '@/models/login';
import type { LoginParamsType } from '@/services/login';
import type { ConnectState } from '@/models/connect';
import styles from './index.less';
import { register } from './../../../services/login';
export type LoginProps = {
  dispatch: Dispatch;
  userLogin: StateType;
  submitting?: boolean;
};

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC<LoginProps> = (props) => {
  const { userLogin = {}, submitting } = props;
  console.log(userLogin);
  const { status, msg } = userLogin;
  const [regorlog, setType] = useState<string>('account');

  const handleSubmit = async (values: LoginParamsType) => {
    const { dispatch } = props;

    if (regorlog === 'register') {
      let res = await register(values);

      if (res.code === 1) {
        message.success('注册成功，请登录！');
        setType('account');
      } else {
        message.error(res.msg);
      }

      return;
    }

    dispatch({
      type: 'login/login',
      payload: { ...values },
    });
  };

  return (
    <div className={styles.main}>
      <ProForm
        initialValues={{
          autoLogin: true,
          email: '18398216881@163.com',
          password: '18398216881',
        }}
        submitter={{
          render: (_, dom) => dom.pop(),
          submitButtonProps: {
            loading: submitting,
            size: 'large',
            style: {
              width: '100%',
            },
          },
        }}
        onFinish={(values) => {
          handleSubmit(values as LoginParamsType);
          return Promise.resolve();
        }}
      >
        <Tabs
          activeKey={regorlog}
          onChange={(v) => {
            setType(v);
          }}
        >
          <Tabs.TabPane key="account" tab="邮箱登录" />
          <Tabs.TabPane key="register" tab="新用户注册" />
        </Tabs>

        {regorlog === 'account' && (
          <>
            {status === -1 && regorlog === 'account' && !submitting && (
              <LoginMessage content={msg as string} />
            )}
            <ProFormText
              name="email"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={styles.prefixIcon} />,
              }}
              placeholder={'登陆邮箱'}
              rules={[
                {
                  required: true,
                  message: '用户名是必填项！',
                },
                {
                  pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                  message: '邮箱格式错误！',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={styles.prefixIcon} />,
              }}
              placeholder={'密码'}
              rules={[
                {
                  required: true,
                  message: '密码是必填项！',
                },
              ]}
            />
          </>
        )}

        {regorlog === 'register' && (
          <>
            {status === -1 && regorlog === 'register' && !submitting && (
              <LoginMessage content={msg as string} />
            )}
            <ProFormText
              width="md"
              fieldProps={{
                size: 'large',
                prefix: <MailOutlined className={styles.prefixIcon} />,
              }}
              rules={[
                {
                  required: true,
                  message: '邮箱是必填项！',
                },
                {
                  pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                  message: '邮箱格式错误！',
                },
              ]}
              name="email"
              placeholder="登录邮箱"
            />
            <ProFormText.Password
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={styles.prefixIcon} />,
              }}
              rules={[
                {
                  required: true,
                  message: '密码是必填项！',
                },
              ]}
              width="md"
              name="password"
              placeholder="密码"
            />
            <ProFormText.Password
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={styles.prefixIcon} />,
              }}
              rules={[
                {
                  required: true,
                  message: '确认密码是必填项！',
                },
              ]}
              width="md"
              name="confirm_pwd"
              placeholder="确认密码"
            />
            <ProFormText
              width="md"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={styles.prefixIcon} />,
              }}
              rules={[
                {
                  required: true,
                  message: '姓名是必填项！',
                },
                {
                  max: 10,
                  message: '您的名字应该没有这么长!',
                },
                {
                  pattern: /^[\u4E00-\u9FA5]/,
                  message: '请输入正确的中文名字',
                },
              ]}
              name="true_name"
              placeholder="真实姓名"
            />
          </>
        )}
        <div
          style={{
            marginBottom: 24,
          }}
        >
          <ProFormCheckbox noStyle name="autoLogin">
            自动登录
          </ProFormCheckbox>
          <a
            style={{
              float: 'right',
            }}
          >
            忘记密码 ?
          </a>
        </div>
      </ProForm>
    </div>
  );
};

export default connect(({ login, loading }: ConnectState) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
