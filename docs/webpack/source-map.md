# source-map

- 是为了解决开发代码与实际代码不一致时帮助我们debug到原始代码的技术
- webpack可以自动给我source-map文件，map文件是一种对应编译文件和源文件的方法

**关键词**
1. source-mapx
  - 产生.map文件(包含行，列信息)
2. eval 
  - 把代码通过eval包裹起来
3. cheap
  - 不包含列信息，没有源文件映射。只有编译过后的代码
4. module
  - 包含loader的source-map。可以找到源文件。可以找到源文件的信息
5. inline
  - 内嵌到打包后的文件里面

devtool: 
inline-source-map /
cheap-source-map /
cheap-module-source-map /
source-map /
eval-source-map