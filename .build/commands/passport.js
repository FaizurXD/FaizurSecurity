import { SlashCommandBuilder, AttachmentBuilder } from "discord.js";
import sharp from "sharp";
import { loadImage, defaultError } from "../utils.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import { join } from "node:path";
import prisma from "../database.js";
dayjs.extend(relativeTime);
export default class Info {
  constructor() {
    this.data = new SlashCommandBuilder().setName("passport").setNameLocalizations({ "es-ES": "pasaporte" }).setDescription("A card with all important info of a user.").setDescriptionLocalizations({ "es-ES": "Una tarjeta con toda la informacion importante de un usuario." }).addUserOption(
      (option) => option.setName("user").setNameLocalizations({ "es-ES": "usuario" }).setDescription("You can pass a mention or an id of a user.").setDescriptionLocalizations({ "es-ES": "Puedes pasar una menci\xF3n o un id de un usuaria" })
    );
  }
  async run(interaction) {
    var _a, _b, _c;
    const user = interaction.options.getUser("user") ?? interaction.user;
    if (user.bot) {
      await interaction.reply({ content: "<:error:1009134465995509810> | **You cannot get reports for a bot**", ephemeral: true });
      return;
    }
    await interaction.deferReply();
    try {
      const avatarBuffer = await loadImage(user.displayAvatarURL());
      const roundedCorners = Buffer.from(`
				<svg>
					<rect x="0" y="0" width="128" height="128" rx="50%" ry="50%"/>
				</svg>
	 		`);
      const toxicityUser = await prisma.user.findUnique({
        where: { user: user.id },
        select: { toxicity: true, reports: true, warns: true }
      });
      const toxicity = (_a = toxicityUser == null ? void 0 : toxicityUser.toxicity) == null ? void 0 : _a.toFixed(2);
      const username = Buffer.from(`
				<svg width="618" height="437">
	 				<style>
		 				.name {
							font-size: ${user.tag.length > 25 ? "20" : user.tag.length > 22 ? "22" : "25"}px;
							font-family: sans-serif;
							font-weight: bold;
							fill: #fff;
						}

	 					.tag {
							font-size: 20px;
							font-family: sans-serif;
							font-weight: bold;
							fill: #bdbdbd;
						}
	 				</style>
		 	 		<text x="40" y="140" class="name">
						${user.username}<tspan class="tag">#${user.discriminator}</tspan>
		 			</text>
					<text x="410" y="140" class="name">
						<tspan class="tag">Danger:</tspan> ${((toxicity == null ? void 0 : toxicity.endsWith("00")) ? toxicity == null ? void 0 : toxicity.slice(0, -3) : (toxicity == null ? void 0 : toxicity.endsWith("0")) ? toxicity == null ? void 0 : toxicity.slice(0, -1) : toxicity) ?? 0}%
		 			</text>
					<text x="410" y="180" class="name">
						<tspan class="tag">Warnings:</tspan> ${((_b = toxicityUser == null ? void 0 : toxicityUser.warns) == null ? void 0 : _b.length) ?? 0}
		 			</text>
					<text x="410" y="220" class="name">
						<tspan class="tag">Reports:</tspan> ${((_c = toxicityUser == null ? void 0 : toxicityUser.reports) == null ? void 0 : _c.length) ?? 0}
		 			</text>
					<text x="40" y="180" class="tag">Created ${dayjs(user.createdAt).fromNow()}</text>
				</svg>
 			`);
      const circle = Buffer.from(`
	 			<svg>
					<rect x="0" y="0" width="158" height="158" rx="50%" ry="50%" fill="#0000f5"/>
				</svg>
	 		`);
      const avatarRoundedBuffer = await sharp(avatarBuffer).resize(128, 128).composite([
        {
          input: roundedCorners,
          blend: "dest-in"
        }
      ]).png().toBuffer();
      const avatarBorderBuffer = await sharp(circle).composite([
        {
          input: avatarRoundedBuffer
        }
      ]).png().toBuffer();
      const image = await sharp({
        create: {
          channels: 4,
          width: 618,
          height: 537,
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        }
      }).composite([
        {
          input: join(process.cwd(), "./assets/background.png")
        },
        {
          input: avatarBorderBuffer,
          top: 0,
          left: 60
        },
        { input: username }
      ]).png().toBuffer();
      await interaction.editReply({ files: [new AttachmentBuilder(image, { name: "card.png" })] });
    } catch (e) {
      console.error(e);
      await interaction.editReply(defaultError);
    }
  }
}
//# sourceMappingURL=passport.js.map
