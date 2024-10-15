// 创建 VueI18n 实例
const i18n = new VueI18n({
    locale: navigator.language.startsWith('zh') ? 'zh' : 'en', // 设置默认语言
    fallbackLocale: 'en', // 设置回退语言
    messages: translations, // 使用从 translations.js 导入的翻译
});

// 在 Vue 实例之前添加这个函数
function translateError(error) {
    const errorMessages = {
        en: {
            'Invalid credentials': 'Invalid username or password',
            'Failed to generate email address': 'Failed to generate email address. Please try again.',
            // ... 添加更多错误消息翻译
        },
        zh: {
            'Invalid credentials': '用户名或密码错误',
            'Failed to generate email address': '生成邮箱地址失败，请重试。',
            // ... 添加更多错误消息翻译
        }
    };

    const locale = i18n.locale;
    return errorMessages[locale][error] || error;
}

// 修改所有组件，使用 $t 函数进行翻译
// 例如：
Vue.component('login-form', {
    template: `
        <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 class="text-2xl font-bold mb-6 text-center">{{ $t('login') }}</h2>
            <form @submit.prevent="login">
                <div class="mb-4">
                    <input v-model="username" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" :placeholder="$t('username')" required>
                </div>
                <div class="mb-6">
                    <input v-model="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" type="password" :placeholder="$t('password')" required>
                </div>
                <div class="flex items-center justify-between">
                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">{{ $t('loginButton') }}</button>
                    <a @click="$emit('switch-to-register')" class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 cursor-pointer">
                        {{ $t('register') }}
                    </a>
                </div>
            </form>
        </div>
    `,
    data() {
        return {
            username: '',
            password: ''
        };
    },
    methods: {
        handleError(errorKey, error) {
            console.error(this.$t(errorKey), error);
            alert(this.$t(errorKey));
        },
        async login() {
            try {
                const response = await axios.post('/login', {
                    username: this.username,
                    password: this.password
                });
                console.log('Login response:', response.data);
                this.$emit('login-success', response.data.user, response.data.token);
            } catch (error) {
                this.handleError('loginFailed', error);
            }
        }
    }
});

// 注册表单组件
Vue.component('register-form', {
    template: `
        <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 class="text-2xl font-bold mb-6 text-center">{{ $t('register') }}</h2>
            <form @submit.prevent="register">
                <div class="mb-4">
                    <input v-model="username" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" :placeholder="$t('username')" required>
                </div>
                <div class="mb-6">
                    <input v-model="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" type="password" :placeholder="$t('password')" required>
                </div>
                <div class="flex items-center justify-between">
                    <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">{{ $t('registerButton') }}</button>
                    <a @click="$emit('switch-to-login')" class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 cursor-pointer">
                        {{ $t('login') }}
                    </a>
                </div>
            </form>
        </div>
    `,
    data() {
        return {
            username: '',
            password: ''
        };
    },
    methods: {
        handleError(errorKey, error) {
            console.error(this.$t(errorKey), error);
            alert(this.$t(errorKey));
        },
        async register() {
            try {
                await axios.post('/register', {
                    username: this.username,
                    password: this.password
                });
                alert(this.$t('registerSuccess'));
                this.$emit('switch-to-login');
                this.username = '';
                this.password = '';
            } catch (error) {
                this.handleError('registerFailed', error);
            }
        }
    }
});

// 用户信息组件
Vue.component('user-info', {
    props: ['user'],
    template: `
        <div class="bg-white shadow-md rounded px-8 py-4 flex justify-between items-center">
            <h2 class="text-xl font-semibold">{{ $t('welcome') }}, {{ user.username }}</h2>
            <div>
                <button @click="showPasswordChange" class="btn btn-blue mr-2">{{ $t('changePassword') }}</button>
                <button @click="logout" class="btn btn-red">{{ $t('logout') }}</button>
            </div>
        </div>
    `,
    methods: {
        showPasswordChange() {
            this.$emit('show-password-change');
        },
        async logout() {
            try {
                // 移除本地存储的 token
                localStorage.removeItem('token');
                this.$emit('logout');
            } catch (error) {
                console.error(this.$t('logoutFailed'), error);
            }
        }
    }
});

// 邮箱地址生成器组件
Vue.component('address-generator', {
    template: `
        <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 class="text-2xl font-bold mb-6">{{ $t('generateAlias') }}</h2>
            <form @submit.prevent="generateAddress">
                <div class="mb-4">
                    <input v-model="realAddress" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" :placeholder="$t('realAddress')">
                </div>
                <div class="mb-4">
                    <select v-model="selectedTokenId" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                        <option value="">{{ $t('selectToken') }}</option>
                        <option v-for="token in tokens" :key="token.ID" :value="token.ID">
                            {{ token.Description || token.Value }}
                        </option>
                    </select>
                </div>
                <div class="flex items-center justify-center">
                    <button class="btn btn-blue px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition duration-300" type="submit">{{ $t('generateButton') }}</button>
                </div>
            </form>
            <div v-if="generatedAddress" class="mt-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
                <p>{{ $t('generatedAddress') }}：{{ generatedAddress }}</p>
                <button @click="copyAddress" class="btn btn-green mt-2 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition duration-300">{{ $t('copyButton') }}</button>
            </div>
        </div>
    `,
    data() {
        return {
            realAddress: '',
            generatedAddress: '',
            selectedTokenId: '',
            tokens: []
        };
    },
    mounted() {
        this.fetchTokens();
    },
    methods: {
        handleError(errorKey, error) {
            console.error(this.$t(errorKey), error);
            alert(this.$t(errorKey));
        },
        async fetchTokens() {
            try {
                const response = await axios.get('/get-tokens', {
                    headers: { 'Authorization': localStorage.getItem('token') }
                });
                this.tokens = response.data.tokens;
            } catch (error) {
                this.handleError('fetchTokensFailed', error);
            }
        },
        async generateAddress() {
            if (!this.selectedTokenId) {
                alert(this.$t('selectToken'));
                return;
            }
            try {
                const response = await axios.post('/generate-address', {
                    real_address: this.realAddress,
                    token_id: this.selectedTokenId
                }, {
                    headers: { 'Authorization': localStorage.getItem('token') }
                });
                this.generatedAddress = response.data.generated_address;
                this.$emit('address-generated');
            } catch (error) {
                this.handleError('generateAddressFailed', error);
            }
        },
        copyAddress() {
            navigator.clipboard.writeText(this.generatedAddress).then(() => {
                alert(this.$t('addressCopied'));
            }, (err) => {
                console.error(this.$t('unableToCopy'), err);
            });
        }
    },
});

// 地址列表组件
Vue.component('address-list', {
    template: `
        <div class="address-list-container">
            <h2 class="text-2xl font-bold mb-6">{{ $t('myAliases') }}</h2>
            <div v-if="addresses.length === 0" class="text-gray-500">
                {{ $t('noAliases') }}
            </div>
            <table v-else class="address-list-table min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('aliasAddress') }}</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('realRecipient') }}</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('tokenLabel') }}</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('actions') }}</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="address in addresses" :key="address.ID">
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ address.ConvertedAddress }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ address.RealAddress || '-' }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ address.TokenDescription || '-' }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button @click="deleteAddress(address.ID)" class="text-red-600 hover:text-red-900">{{ $t('delete') }}</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `,
    data() {
        return {
            addresses: []
        };
    },
    mounted() {
        this.fetchAddresses();
    },
    methods: {
        handleError(errorKey, error) {
            console.error(this.$t(errorKey), error);
            alert(this.$t(errorKey));
        },
        async fetchAddresses() {
            try {
                const response = await axios.get('/addresses', {
                    headers: { 'Authorization': localStorage.getItem('token') }
                });
                this.addresses = response.data.addresses;
            } catch (error) {
                this.handleError('fetchAddressesFailed', error);
            }
        },
        async deleteAddress(id) {
            if (confirm(this.$t('confirmDeleteAddress'))) {
                try {
                    await axios.delete(`/address/${id}`, {
                        headers: { 'Authorization': localStorage.getItem('token') }
                    });
                    this.fetchAddresses();
                } catch (error) {
                    this.handleError('deleteAddressFailed', error);
                }
            }
        }
    }
});

// Token 管理组件
Vue.component('token-manager', {
    template: `
        <div class="bg-white shadow-md rounded px-8 pt-6 pb-8">
            <h2 class="text-2xl font-bold mb-6">{{ $t('addNewToken') }}</h2>
            <div class="mb-4">
                <input v-model="newToken.value" :type="showNewToken ? 'text' : 'password'" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2 mb-2" :placeholder="$t('tokenValue')">
                <button @click="showNewToken = !showNewToken" class="btn btn-gray mb-2 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition duration-300">
                    {{ showNewToken ? $t('showHide') : $t('showHide') }}
                </button>
                <input v-model="newToken.description" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2 mb-2" type="text" :placeholder="$t('tokenDescription')">
                <button @click="addToken" class="btn btn-blue px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition duration-300">{{ $t('saveToken') }}</button>
            </div>
            <div v-if="tokens.length > 0" class="mb-4">
                <h3 class="text-xl font-semibold mb-2">{{ $t('savedTokens') }}:</h3>
                <ul class="divide-y divide-gray-200">
                    <li v-for="token in tokens" :key="token.ID" class="py-2 flex justify-between items-center">
                        <div>
                            <p class="font-medium">{{ token.Description || 'Token' }}</p>
                            <p class="text-sm text-gray-500">
                                {{ showTokenValue[token.ID] ? token.Value : '••••••••' }}
                                <button @click="toggleTokenVisibility(token.ID)" class="btn btn-gray ml-2 px-3 py-1 rounded-md shadow-sm hover:shadow-md transition duration-300">
                                    {{ showTokenValue[token.ID] ? $t('showHide') : $t('showHide') }}
                                </button>
                            </p>
                        </div>
                        <div>
                            <button @click="deleteToken(token.ID)" class="btn btn-red ml-2 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition duration-300">{{ $t('delete') }}</button>
                        </div>
                    </li>
                </ul>
            </div>
            <button @click="$emit('back')" class="btn btn-blue mt-4 px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition duration-300">{{ $t('back') }}</button>
        </div>
    `,
    data() {
        return {
            tokens: [],
            newToken: {
                value: '',
                description: ''
            },
            showNewToken: false,
            showTokenValue: {}
        };
    },
    mounted() {
        this.fetchTokens();
    },
    methods: {
        handleError(errorKey, error) {
            console.error(this.$t(errorKey), error);
            alert(this.$t(errorKey));
        },
        async fetchTokens() {
            try {
                const response = await axios.get('/get-tokens', {
                    headers: { 'Authorization': localStorage.getItem('token') }
                });
                this.tokens = response.data.tokens;
                this.tokens.forEach(token => {
                    this.$set(this.showTokenValue, token.ID, false);
                });
            } catch (error) {
                this.handleError('fetchTokensFailed', error);
            }
        },
        async addToken() {
            if (!this.newToken.value) {
                alert(this.$t('tokenRequired'));
                return;
            }
            try {
                await axios.post('/add-token', this.newToken, {
                    headers: { 'Authorization': localStorage.getItem('token') }
                });
                await this.fetchTokens();
                this.newToken = { value: '', description: '' };
                alert(this.$t('tokenAdded'));
                this.$emit('token-added'); // 发射事件
            } catch (error) {
                this.handleError('tokenAddFailed', error);
            }
        },
        toggleTokenVisibility(tokenId) {
            this.$set(this.showTokenValue, tokenId, !this.showTokenValue[tokenId]);
        },
        async deleteToken(tokenId) {
            if (!confirm(this.$t('confirmDeleteToken'))) {
                return;
            }
            try {
                await axios.delete(`/delete-token/${tokenId}`, {
                    headers: { 'Authorization': localStorage.getItem('token') }
                });
                await this.fetchTokens();
                alert(this.$t('tokenDeleted'));
            } catch (error) {
                this.handleError('deleteTokenFailed', error);
            }
        }
    }
});

// 新增管理员密码修改组件
Vue.component('admin-change-password', {
    template: `
        <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 class="text-2xl font-bold mb-6">{{ $t('changeAdminPassword') }}</h2>
            <form @submit.prevent="changePassword">
                <div class="mb-4">
                    <input v-model="oldPassword" type="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" :placeholder="$t('oldPassword')" required>
                </div>
                <div class="mb-4">
                    <input v-model="newPassword" type="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" :placeholder="$t('newPassword')" required>
                </div>
                <div class="mb-6">
                    <input v-model="confirmPassword" type="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" :placeholder="$t('confirmPassword')" required>
                </div>
                <div class="flex items-center justify-between">
                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                            type="submit" 
                            :disabled="!isPasswordValid">
                        {{ $t('changePasswordButton') }}
                    </button>
                </div>
            </form>
            <button @click="$emit('back')" class="mt-4 text-blue-500 hover:text-blue-800">{{ $t('back') }}</button>
        </div>
    `,
    data() {
        return {
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        };
    },
    computed: {
        isPasswordValid() {
            return this.newPassword === this.confirmPassword && this.newPassword.length >= 8;
        }
    },
    methods: {
        async changePassword() {
            if (!this.isPasswordValid) {
                alert(this.$t('passwordMismatch'));
                return;
            }
            try {
                await axios.post('/admin/change-password', {
                    old_password: this.oldPassword,
                    new_password: this.newPassword
                }, {
                    headers: { 'Authorization': localStorage.getItem('token') }
                });
                alert(this.$t('adminPasswordChanged'));
                this.oldPassword = '';
                this.newPassword = '';
                this.confirmPassword = '';
                this.$emit('password-changed');
            } catch (error) {
                this.handleError('adminPasswordChangeFailed', error);
            }
        }
    }
});

// 管理员面板组件
Vue.component('admin-panel', {
    template: `
        <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 class="text-2xl font-bold mb-6">{{ $t('adminPanel') }}</h2>
            <h3 class="text-xl font-semibold mb-4">{{ $t('userManagement') }}</h3>
            <div class="mb-8">
                <button @click="showCreateUserForm = !showCreateUserForm" class="btn btn-blue px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
                    {{ showCreateUserForm ? $t('hideCreateUserForm') : $t('createUser') }}
                </button>
            </div>
            <div v-if="showCreateUserForm" class="mb-8">
                <h4 class="text-lg font-semibold mb-2">{{ $t('createUser') }}</h4>
                <input v-model="newUser.username" :placeholder="$t('newUsername')" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2">
                <input v-model="newUser.password" type="password" :placeholder="$t('newPassword')" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2">
                <label class="inline-flex items-center mb-2">
                    <input type="checkbox" v-model="newUser.isAdmin" class="form-checkbox">
                    <span class="ml-2">{{ $t('isAdmin') }}</span>
                </label>
                <button @click="createUser" class="btn btn-green w-full px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition duration-300">{{ $t('createNewUser') }}</button>
            </div>
            <div>
                <h4 class="text-lg font-semibold mb-2">{{ $t('userList') }}</h4>
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('id') }}</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('username') }}</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('isAdmin') }}</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{{ $t('actions') }}</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="user in users" :key="user.ID">
                            <td class="px-6 py-4 whitespace-nowrap">{{ user.ID }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">{{ user.Username }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">{{ user.IsAdmin ? $t('isAdminYes') : $t('isAdminNo') }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <button @click="deleteUser(user.ID)" class="btn btn-red mr-2 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition duration-300">{{ $t('deleteUser') }}</button>
                                <button @click="resetPassword(user.ID)" class="btn btn-green px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition duration-300">{{ $t('resetPassword') }}</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `,
    data() {
        return {
            users: [],
            newUser: {
                username: '',
                password: '',
                isAdmin: false
            },
            showCreateUserForm: false
        };
    },
    mounted() {
        this.fetchUsers();
    },
    methods: {
        async fetchUsers() {
            try {
                const response = await axios.get('/admin/users', {
                    headers: { 'Authorization': localStorage.getItem('token') }
                });
                this.users = response.data.users;
            } catch (error) {
                console.error(this.$t('fetchUsersFailed'), error);
                alert(this.$t('fetchUsersFailed'));
            }
        },
        async createUser() {
            try {
                await axios.post('/admin/create-user', this.newUser, {
                    headers: { 'Authorization': localStorage.getItem('token') }
                });
                alert(this.$t('userCreated'));
                this.newUser = { username: '', password: '', isAdmin: false };
                this.fetchUsers();
            } catch (error) {
                this.handleError('createUserFailed', error);
            }
        },
        async deleteUser(userId) {
            if (confirm(this.$t('confirmDelete'))) {
                try {
                    await axios.delete(`/admin/delete-user/${userId}`, {
                        headers: { 'Authorization': localStorage.getItem('token') }
                    });
                    alert(this.$t('userDeleted'));
                    this.fetchUsers();
                } catch (error) {
                    this.handleError('deleteUserFailed', error);
                }
            }
        },
        async resetPassword(userId) {
            const newPassword = prompt(this.$t('newPassword'));
            if (newPassword) {
                try {
                    await axios.post(`/admin/reset-password/${userId}`, { password: newPassword }, {
                        headers: { 'Authorization': localStorage.getItem('token') }
                    });
                    alert(this.$t('passwordReset'));
                } catch (error) {
                    this.handleError('passwordResetFailed', error);
                }
            }
        }
    }
});

// 地址转换组件
Vue.component('address-converter', {
    template: `
        <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 class="text-2xl font-bold mb-6">{{ $t('addressConverter') }}</h2>
            <div class="mb-4">
                <select v-model="conversionType" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    <option value="duckToReal">{{ $t('duckToReal') }}</option>
                    <option value="realToDuck">{{ $t('realToDuck') }}</option>
                </select>
            </div>
            <div class="mb-4">
                <input v-model="inputAddress" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" :placeholder="inputPlaceholder">
            </div>
            <div v-if="conversionType === 'realToDuck'" class="mb-4">
                <input v-model="duckAddress" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" :placeholder="$t('inputDuckAddressShort')">
            </div>
            <div class="flex items-center justify-center">
                <button @click="convertAddress" class="btn btn-blue px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition duration-300">{{ $t('convert') }}</button>
            </div>
            <div v-if="convertedAddresses.length > 0" class="mt-4">
                <h3 class="text-xl font-semibold mb-2">{{ $t('conversionResult') }}：</h3>
                <div v-for="(address, index) in convertedAddresses" :key="index" class="mb-2 p-3 bg-gray-100 rounded-lg">
                    <p><strong>{{ address.label }}:</strong> {{ address.value }}</p>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            conversionType: 'duckToReal',
            inputAddress: '',
            duckAddress: '',
            convertedAddresses: []
        };
    },
    computed: {
        inputPlaceholder() {
            return this.conversionType === 'duckToReal' 
                ? this.$t('inputDuckAddress')
                : this.$t('inputRealAddress');
        }
    },
    methods: {
        convertAddress() {
            if (this.conversionType === 'duckToReal') {
                this.convertDuckToReal();
            } else {
                this.convertRealToDuck();
            }
        },
        convertDuckToReal() {
            if (!this.inputAddress.includes('_at_') || !this.inputAddress.endsWith('@duck.com')) {
                alert(this.$t('invalidDuckAddressFormat'));
                return;
            }
            const parts = this.inputAddress.split('_');
            const duckAddress = parts.pop().split('@')[0] + '@duck.com';
            const realAddress = parts.join('_').replace('_at_', '@');
            this.convertedAddresses = [
                { label: this.$t('realRecipientAddress'), value: realAddress },
                { label: this.$t('duckAddress'), value: duckAddress }
            ];
        },
        convertRealToDuck() {
            if (!this.inputAddress.includes('@') || !this.duckAddress.endsWith('@duck.com')) {
                alert(this.$t('invalidAddressFormat'));
                return;
            }
            const duckPart = this.duckAddress.split('@')[0];
            const realPart = this.inputAddress.replace('@', '_at_');
            const convertedAddress = `${realPart}_${duckPart}@duck.com`;
            this.convertedAddresses = [
                { label: this.$t('convertedDuckAddress'), value: convertedAddress }
            ];
        }
    }
});

// 修改密码组件（可以被普通用户和管理员共用）
Vue.component('change-password', {
    template: `
        <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 class="text-2xl font-bold mb-6">{{ $t('changePassword') }}</h2>
            <form @submit.prevent="changePassword">
                <div class="mb-4">
                    <input v-model="oldPassword" type="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" :placeholder="$t('oldPassword')" required>
                </div>
                <div class="mb-4">
                    <input v-model="newPassword" type="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" :placeholder="$t('newPassword')" required>
                </div>
                <div class="mb-2 flex">
                    <span v-for="(char, index) in newPassword" :key="index" 
                          class="w-2 h-2 rounded-full mr-1"
                          :class="getMatchClass(index)">
                    </span>
                </div>
                <div class="mb-6">
                    <input v-model="confirmPassword" type="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" :placeholder="$t('confirmPassword')" required>
                </div>
                <div v-if="!isPasswordValid" class="mb-4 text-red-500">
                    {{ $t('passwordRequirements') }}
                </div>
                <div class="flex items-center justify-between">
                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                            type="submit" 
                            :disabled="!isPasswordValid">
                        {{ $t('changePasswordButton') }}
                    </button>
                </div>
            </form>
            <button @click="$emit('back')" class="mt-4 text-blue-500 hover:text-blue-800">{{ $t('back') }}</button>
        </div>
    `,
    data() {
        return {
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
        };
    },
    computed: {
        isPasswordValid() {
            return this.newPassword === this.confirmPassword && this.newPassword.length >= 8;
        }
    },
    methods: {
        async changePassword() {
            if (!this.isPasswordValid) {
                alert(this.$t('passwordMismatch'));
                return;
            }
            try {
                await axios.post('/change-password', {
                    old_password: this.oldPassword,
                    new_password: this.newPassword
                }, {
                    headers: { 'Authorization': localStorage.getItem('token') }
                });
                alert(this.$t('passwordChanged'));
                this.oldPassword = '';
                this.newPassword = '';
                this.confirmPassword = '';
                this.$emit('password-changed');
            } catch (error) {
                console.error('修改密码失败:', error);
                alert(this.$t('passwordChangeFailed'));
            }
        },
        getMatchClass(index) {
            if (index >= this.confirmPassword.length) {
                return 'bg-gray-300';
            }
            return this.confirmPassword[index] === this.newPassword[index] ? 'bg-green-500' : 'bg-red-500';
        }
    }
});

// 修改 Vue 实例
new Vue({
    i18n,
    el: '#app',
    data: {
        loggedIn: false,
        currentUser: null,
        showLogin: true,
        showTokenPage: false,
        showAddressConverter: false,
        showChangePassword: false,
        showAdminChangePassword: false
    },
    mounted() {
        this.checkAuth();
        document.title = this.$t('title');
    },
    methods: {
        async checkAuth() {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('/check-auth', {
                        headers: { 'Authorization': token }
                    });
                    this.loggedIn = true;
                    this.currentUser = response.data.user;
                } catch (error) {
                    this.handleError('authFailed', error);
                    localStorage.removeItem('token');
                }
            }
        },
        onLoginSuccess(user, token) {
            this.loggedIn = true;
            this.currentUser = user;
            localStorage.setItem('token', token);
        },
        onLogout() {
            this.loggedIn = false;
            this.currentUser = null;
            this.showLogin = true;
            localStorage.removeItem('token');
            alert(this.$t('logoutSuccess'));
        },
        onAddressGenerated() {
            this.$refs.addressList.fetchAddresses();
        },
        onTokenAdded() {
            // 刷新地址生成器的 token 列表
            this.$refs.addressGenerator.fetchTokens();
        },
        showTokenManagement() {
            this.showTokenPage = true;
            this.showAddressConverter = false;
        },
        hideTokenManagement() {
            this.showTokenPage = false;
            this.showAddressConverter = false;
        },
        showAddressConversion() {
            this.showAddressConverter = true;
            this.showTokenPage = false;
        },
        toggleLanguage() {
            this.$i18n.locale = this.$i18n.locale === 'en' ? 'zh' : 'en';
            document.title = this.$t('title'); // 更新标题
        },
        showPasswordChange() {
            this.showChangePassword = true;
            this.showTokenPage = false;
            this.showAddressConverter = false;
        },
        hidePasswordChange() {
            this.showChangePassword = false;
        },
        showAdminPasswordChange() {
            this.showAdminChangePassword = true;
        },
        hideAdminPasswordChange() {
            this.showAdminChangePassword = false;
        }
    },
    template: `
        <div class="max-w-4xl mx-auto">
            <div class="flex justify-between items-center mb-8">
                <h1 class="text-3xl font-bold text-gray-800">{{ $t('title') }}</h1>
                <button @click="toggleLanguage" class="btn btn-blue">
                    {{ $i18n.locale === 'en' ? '中文' : 'English' }}
                </button>
            </div>
            <div v-if="!loggedIn">
                <div v-if="showLogin">
                    <login-form @login-success="onLoginSuccess" @switch-to-register="showLogin = false"></login-form>
                </div>
                <div v-else>
                    <register-form @switch-to-login="showLogin = true"></register-form>
                </div>
            </div>
            <div v-else>
                <div class="bg-white shadow-md rounded px-8 py-4 flex justify-between items-center mb-8">
                    <h2 class="text-xl font-semibold">{{ $t('welcome') }}, {{ currentUser.username }}</h2>
                    <div>
                        <button @click="showPasswordChange" class="btn btn-blue mr-2">{{ $t('changePassword') }}</button>
                        <button @click="onLogout" class="btn btn-red">{{ $t('logout') }}</button>
                    </div>
                </div>
                <div v-if="currentUser.isAdmin && !showChangePassword">
                    <admin-panel></admin-panel>
                </div>
                <div v-else-if="!showTokenPage && !showAddressConverter && !showChangePassword" class="grid grid-cols-1 gap-8">
                    <address-generator @address-generated="onAddressGenerated" class="mb-8"></address-generator>
                    <div class="flex space-x-4 justify-center mb-8">
                        <button @click="showTokenManagement" class="btn btn-blue px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition duration-300">{{ $t('manageTokens') }}</button>
                        <button @click="showAddressConversion" class="btn btn-green px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition duration-300">{{ $t('addressConverter') }}</button>
                    </div>
                    <address-list ref="addressList"></address-list>
                </div>
                <div v-else-if="showTokenPage">
                    <token-manager @token-added="onTokenAdded" @back="hideTokenManagement"></token-manager>
                </div>
                <div v-else-if="showAddressConverter">
                    <address-converter></address-converter>
                    <button @click="hideTokenManagement" class="btn btn-blue mt-4 px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition duration-300">{{ $t('back') }}</button>
                </div>
                <div v-else-if="showChangePassword">
                    <change-password @back="hidePasswordChange"></change-password>
                </div>
            </div>
        </div>
    `
});
