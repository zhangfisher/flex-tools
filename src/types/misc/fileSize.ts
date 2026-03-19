/**
 * 表示文件大小的类型，支持纯数字（字节数）或带单位的字符串格式。
 * 支持的单位包括：
 * - B/Byte/Bytes：字节
 * - K/KB/kb：千字节
 * - M/MB/mb：兆字节
 * - G/GB/gb：吉字节
 * - T/TB/tb：太字节
 * - P/PB/pb：拍字节
 * - E/EB/eb：艾字节
 * 
 * @example
 * ```typescript
 * // 使用数字（表示字节）
 * const size1: FileSize = 1024;
 * 
 * // 使用带单位的字符串
 * const size2: FileSize = "1.5MB";
 * const size3: FileSize = "500KB";
 * const size4: FileSize = "2.5GB";
 * 
 * // 函数参数类型
 * function validateFileSize(size: FileSize): boolean {
 *   // 实现文件大小验证逻辑
 *   return true;
 * }
 * 
 * // 配置对象中使用
 * interface UploadConfig {
 *   maxSize: FileSize;
 *   minSize: FileSize;
 * }
 * 
 * const config: UploadConfig = {
 *   maxSize: "10MB",
 *   minSize: 1024 // 1KB
 * };
 * 
 * // 所有有效的单位写法
 * const examples: FileSize[] = [
 *   "1B",     // 字节
 *   "1Byte",
 *   "1Bytes",
 *   "1KB",    // 千字节
 *   "1K",
 *   "1k",
 *   "1kb",
 *   "1MB",    // 兆字节
 *   "1M",
 *   "1m",
 *   "1mb",
 *   "1GB",    // 吉字节
 *   "1G",
 *   "1g",
 *   "1gb"
 *   // ... 其他单位同理
 * ];
 * ```
 */
export type FileSize = number | `${number}${
    'B' | 'Byte' | 'b' | 'Bytes' 
    | 'K' | 'KB' | 'k' | 'kb' 
    | 'M' | 'MB' | 'm' | 'mb'
    | 'G' | 'GB' | 'g' | 'gb'
    | 'T' | 'TB' | 't' | 'tb' 
    | 'P' | 'PB' | 'p' | 'pb' 
    | 'E' | 'EB' | 'e' | 'eb'
}`