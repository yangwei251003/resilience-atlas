# 素材、协议与内容边界

## 自有内容

原创页面、样式、交互代码与项目文档采用根目录 MIT License。项目以 AI 协作方式完成；这不表示作者独立手写全部代码或已熟练掌握全部依赖。

`public/media` 中的三个 `-ai.webp` 是本项目的 AI 概念视觉，原 JPG 保留在 `assets/source-media`，`scripts/optimize-media.mjs` 可重建压缩版本。它们分别用于门户、视频席位和接触印样，不是真实人物肖像、实拍照片、已上映视频或已完成项目截图。源文件名与原README记录了AI来源；没有保留逐字提示词与完整生成日志，不以本记录替代潜在第三方权利。

网站中的人物身份为示例，项目、荣誉、经历、文章、视频与照片采用 `placeholder` / `ai-generated` / `final` 状态。未经真实材料替换和核验，不能把示例当作者简历。

`docs/images` 的截图来自本次实际运行页面，是模板界面截图；画面中的概念视觉仍属于上述AI素材。

## 第三方软件

Next.js、React、Motion、Zod、Phosphor图标等依赖保留各自协议。完整生产依赖声明见 `public/assets/licenses/THIRD_PARTY_NOTICES.md`；可运行 `pnpm licenses:generate` 依据当前安装树重建。生成器保留原版权、许可证与作者声明，根MIT不覆盖第三方软件。

没有打包任何真实证书、私人联系方式、财产账户、支付密钥、位置轨迹、外部视频或私人配置。网站只展示明确的模板占位内容。


## Linux native image-processing dependency

`@img/sharp-libvips-linux-x64@1.3.3` declares LGPL-3.0-or-later and bundles components under the terms listed by its upstream. Its real package README, component versions, complete LGPL/GPL/MPL texts, libvips copyright and exact source provenance are preserved in `public/assets/licenses/upstream/sharp-libvips-1.3.3/`. Packaging scripts use Apache-2.0; that does not replace the native libraries’ licenses. No native binary is added to this repository or static Pages artifact. The collector verifies package identity and versions before using this bundle; unknown/mismatched native versions remain a publication error. Existing GSAP restrictions remain in force.
