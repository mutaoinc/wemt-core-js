<?php

class Crypto {
    private $key;
    private $iv;
    private $algorithm;
    private $iterations;
    private $saltLength;
    
    public function __construct($config = []) {
        $this->key = $config['key'] ?? 'wemt-secure-key-2024';
        $this->iv = $config['iv'] ?? 'wemt-secure-iv-24';
        $this->algorithm = $config['algorithm'] ?? 'AES';
        $this->iterations = $config['iterations'] ?? 10000;
        $this->saltLength = $config['saltLength'] ?? 16;
    }
    
    /**
     * 使用PBKDF2派生密钥
     */
    private function deriveKey($password, $salt) {
        return hash_pbkdf2(
            "sha256",
            $password,
            $salt,
            $this->iterations,
            32,  // 256位/8 = 32字节
            true // 输出原始二进制数据
        );
    }
    
    /**
     * 解密数据
     */
    public function decrypt($encryptedData) {
        try {
            // 解析加密数据
            $data = json_decode($encryptedData, true);
            if (!isset($data['ct']) || !isset($data['s']) || !isset($data['ts'])) {
                throw new Exception('Invalid encrypted data format');
            }
            
            // 获取加密文本、盐值和时间戳
            $ciphertext = $data['ct'];
            $salt = $data['s'];
            $timestamp = $data['ts'];
            
            // 派生密钥
            $derivedKey = $this->deriveKey($this->key . $timestamp, $salt);
            
            // 解密
            $decrypted = openssl_decrypt(
                base64_decode($ciphertext),
                'aes-256-cbc',
                $derivedKey,
                OPENSSL_RAW_DATA,
                $this->iv
            );
            
            if ($decrypted === false) {
                throw new Exception('Decryption failed: ' . openssl_error_string());
            }
            
            return $decrypted;
        } catch (Exception $e) {
            error_log('Decryption error: ' . $e->getMessage());
            throw $e;
        }
    }
    
    /**
     * 加密数据
     */
    public function encrypt($data) {
        try {
            // 生成随机盐值
            $salt = bin2hex(random_bytes($this->saltLength ?? 16));
            $timestamp = (string)time() * 1000; // 毫秒时间戳
            
            // 派生密钥
            $derivedKey = $this->deriveKey($this->key . $timestamp, $salt);
            
            // 加密
            $encrypted = openssl_encrypt(
                $data,
                'aes-256-cbc',
                $derivedKey,
                OPENSSL_RAW_DATA,
                $this->iv
            );
            
            if ($encrypted === false) {
                throw new Exception('Encryption failed: ' . openssl_error_string());
            }
            
            // 组合结果
            $result = [
                'ct' => base64_encode($encrypted),
                's' => $salt,
                'ts' => $timestamp
            ];
            
            return json_encode($result);
        } catch (Exception $e) {
            error_log('Encryption error: ' . $e->getMessage());
            throw $e;
        }
    }
    
    /**
     * 生成哈希值
     */
    public function hash($data, $algorithm = 'SHA256') {
        $algorithm = strtoupper($algorithm);
        switch ($algorithm) {
            case 'MD5':
                return md5($data);
            case 'SHA1':
                return sha1($data);
            case 'SHA256':
                return hash('sha256', $data);
            case 'SHA512':
                return hash('sha512', $data);
            default:
                return hash('sha256', $data);
        }
    }
}

// 修改测试代码
try {
    $config = [
        'key' => 'wemt-secure-key-2024',
        'iv' => 'wemt-secure-iv-24',
        'algorithm' => 'AES',
        'iterations' => 10000,
        'saltLength' => 16
    ];
    
    $crypto = new Crypto($config);
    
    // 测试加密
    $testData = json_encode([
        'username' => 'test',
        'password' => '123456'
    ]);
    
    echo "原始数据: " . $testData . "\n\n";
    
    // 加密数据
    $encrypted = $crypto->encrypt($testData);
    echo "加密后: " . $encrypted . "\n\n";
    
    // 解密数据
    $decrypted = $crypto->decrypt($encrypted);
    echo "解密后: " . $decrypted . "\n\n";
    
    // 测试哈希
    $hash = $crypto->hash('password', 'SHA256');
    echo "SHA256哈希: " . $hash . "\n";
    
} catch (Exception $e) {
    echo "错误: " . $e->getMessage() . "\n";
} 