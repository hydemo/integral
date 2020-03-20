export interface IList<T> {
	// 列表
	readonly list: T[];
	// 总条目
	readonly total: number;
	// 最大值
	readonly max?: number;
}
