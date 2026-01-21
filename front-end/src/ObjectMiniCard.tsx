import clsx from "clsx";

type SearchObjectMiniCardProps = {
  iconLink?: string | null,
  leftLabel1?: { name: string; link?: string },
  leftLabel2?: { name: string; link?: string },
  middleLabel?: { name: string; link?: string },
  endLabel?: { name: string; link?: string },
  className?: string
}

export const ObjectMiniCard = ({
                                       iconLink = null,
                                       leftLabel1 = {link: "", name: ""},
                                       leftLabel2 = {link: "", name: ""},
                                       middleLabel = {link: "", name: ""},
                                       endLabel = {link: "", name: ""},
                                       className = "",
                                     }: SearchObjectMiniCardProps) => {
  let icon: string;
  if (iconLink == null)
    icon = "../../src/assets/default.png"
  else
    icon = iconLink;

  return (
      <div className={`flex flex-row items-center h-16 ${className}`}>
        <div className={clsx('flex flex-row items-start h-16',
            middleLabel.name === "" && endLabel.name === "" ? 'w-full' : 'w-2/4')}>
          <div className="relative mr-3 shrink-0">

            <img
                alt={'Icon'}
                src={icon}
                className={clsx(
                    'w-16 rounded-2xl shadow-xl'
                )}
            />
          </div>

          <div className={clsx('flex flex-col items-start  h-full',
            leftLabel2.name === "" ? 'justify-center' : 'justify-between')}>
            <a href={leftLabel1.link} className={'text-xl'}>{leftLabel1.name}</a>
            <a href={leftLabel2.link} className={'text-[#7A7A7A]'}>{leftLabel2.name}</a>
          </div>
        </div>

        {middleLabel.name !== "" && <a href={middleLabel.link} className={"text-[#7A7A7A] w-1/4"}>{middleLabel.name}</a>}

        {endLabel.name !== "" && <div className={"flex flex-row items-center justify-end h-full gap-5 w-1/4"}>
          <a href={endLabel.link} className={"text-[#7A7A7A]"}>{endLabel.name}</a>
        </div>}
      </div>
  )
}