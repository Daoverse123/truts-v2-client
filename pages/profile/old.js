
const OnBoardForm = () => {
    return (
        <div className={styles.onBoardingFlow}>
            <div className={styles.onBoardingForm}>
                <div className={styles.progressHeader}>
                    <div className={styles.title}>
                        <h1>Your Profile</h1>
                        <p>Complete every details on your profile to earn XP points</p>
                    </div>
                    <div className={styles.xpCon}>
                        <span className={styles.xpIcon}>
                            <img src="/xpCoin.png" alt="" />
                            <p>100 XP</p>
                        </span>
                        <p>Earned so far</p>
                    </div>
                    <div className={styles.progressBar}>
                        <div className={styles.progressInner}></div>
                    </div>
                </div>
                <div className={styles.formContent}>
                    <div className={styles.inputTitle}>
                        <span className={styles.titleSub}>
                            <h1>Your Profile Picture</h1>
                        </span>
                        <span className={styles.iconXp}>
                            <img src="/xpCoin.png" alt="" />
                            <p>50</p>
                        </span>
                    </div>
                    <img className={styles.profilePicture} src="/grad.jpg" alt="" />
                    <div className={styles.inputTitle}>
                        <span className={styles.titleSub}>
                            <h1>TrutsID</h1>
                            <p>Your ENS/Primary Wallet address also serves as Truts ID</p>
                        </span>
                        <span className={styles.iconXp}>
                            <img src="/xpCoin.png" alt="" />
                            <p>50</p>
                        </span>
                    </div>
                    <div className={styles.walletSec}>
                        <span className={styles.walletChip}>
                            <p>xefd....3tf23</p>
                            <img src="/close-icon.png" alt="" />
                        </span>
                        <span className={styles.walletChip}>
                            <p>xefd....3tf23</p>
                            <img src="/close-icon.png" alt="" />
                        </span>
                        <span className={styles.walletChipAdd}>
                            <p>Add more Wallet</p>
                            <img src="/add-icon.png" alt="" />
                        </span>
                    </div>
                    <div className={styles.inputTitle}>
                        <span className={styles.titleSub}>
                            <h1>Bio</h1>
                        </span>
                    </div>
                    <textarea className={styles.bioInput}></textarea>
                    <div className={styles.inputTitle}>
                        <span className={styles.titleSub}>
                            <h1>Your Socials</h1>
                            <p>Connect all your socials to earn XP points</p>
                        </span>
                    </div>
                    <div className={styles.connectSocials}>
                        <div className={styles.socialInput}>
                            <span className={styles.socialInputTitle}>
                                <p>Twitter</p>
                                <img src="/gift.png" alt="" />
                                <p className={styles.xpNum}>50xp</p>
                                <img src="/info.png" alt="" />
                            </span>
                            <span className={styles.walletChip}>
                                <p>xefd....3tf23</p>
                                <img src="/close-icon.png" alt="" />
                            </span>
                        </div>
                    </div>
                    <div className={styles.connectSocials}>
                        <div className={styles.socialInput}>
                            <span className={styles.socialInputTitle}>
                                <p>Discord</p>
                                <img src="/gift.png" alt="" />
                                <p className={styles.xpNum}>50xp</p>
                                <img src="/info.png" alt="" />
                            </span>
                            <span className={styles.walletChip}>
                                <p>xefd....3tf23</p>
                                <img src="/close-icon.png" alt="" />
                            </span>
                        </div>
                    </div>
                    <div className={styles.connectSocials}>
                        <div className={styles.socialInput}>
                            <span className={styles.socialInputTitle}>
                                <p>Email</p>
                                <img src="/gift.png" alt="" />
                                <p className={styles.xpNum}>50xp</p>
                                <img src="/info.png" alt="" />
                            </span>
                            <span className={styles.walletChip}>
                                <p>xefd....3tf23</p>
                                <img src="/close-icon.png" alt="" />
                            </span>
                        </div>
                    </div>
                    <div className={styles.inputTitle}>
                        <span className={styles.titleSub}>
                            <h1>Your Tags</h1>
                            <p>Select tags that describes you</p>
                        </span>
                    </div>
                    <div className={styles.tagsCon}>
                        <div className={styles.selectedChips}>
                            <div className={styles.chip_selected}>
                                <p>Product Designer</p>
                                <img src="/close-icon.png" alt="" />
                            </div>
                            <div className={styles.chip_selected}>
                                <p>Product Designer</p>
                                <img src="/close-icon.png" alt="" />
                            </div>
                            <div className={styles.chip_selected}>
                                <p>Product Designer</p>
                                <img src="/close-icon.png" alt="" />
                            </div>
                        </div>
                        <div className={styles.chipOptions}>
                            <div className={styles.chip}>
                                <p>Product Designer</p>
                            </div>
                            <div className={styles.chip}>
                                <p>Product Designer</p>
                            </div>
                            <div className={styles.chip}>
                                <p>Product Designer</p>
                            </div>
                            <div className={styles.chip}>
                                <p>Product Designer</p>
                            </div>
                            <div className={styles.chip}>
                                <p>Product Designer</p>
                            </div>
                            <div className={styles.chip}>
                                <p>Product Designer</p>
                            </div>
                            <div className={styles.chip}>
                                <p>Product Designer</p>
                            </div>
                            <div className={styles.chip}>
                                <p>Product Designer</p>
                            </div>
                            <div className={styles.chip}>
                                <p>Product Designer</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Communities = () => {
    return (
        <>
            <div className={styles.statCards}>
                <div className={styles.stat}>
                    <h3>Avg Attendence Score</h3>
                    <p>till Date</p>
                    <h1 style={{ color: "#44AC21" }}>82.33</h1>
                </div>
                <div className={styles.stat}>
                    <h3>Total No. of Communites</h3>
                    <p>till Date</p>
                    <h1>128</h1>
                </div>
                <div style={{ width: "fit-content" }} className={styles.stat}>
                    <h3>Your Most Active Community</h3>
                    <p>Updated 1m ago</p>
                    <h1>Bankless</h1>
                </div>
                <div className={styles.stat}>
                    <h3>Dataset XYZ</h3>
                    <p>till Date</p>
                    <h1>82.33</h1>
                </div>
            </div>

            <div className={styles.list_communities_desktop}>
                <h1 className={styles.title}>List of Communities</h1>
                <span className={styles.tableHead}>
                    <p className={styles.name}>Name</p>
                    <p className={styles.joined}>Joined on</p>
                    <p className={styles.score}>Attendence Score</p>
                    <p className={styles.friends}>Your friends</p>
                </span>
                <div className={styles.table}>
                    <span className={styles.entry}>
                        <p className={styles.name}>
                            <img
                                src="https://img.seadn.io/files/4a4061fa04f7ba8d41286bcc2ba22e76.png?fit=max&w=1000"
                                alt=""
                            />
                            Bankless
                        </p>
                        <p className={styles.joined}>Jul 22, 2021</p>
                        <p className={styles.score}>82.33</p>
                        <span className={styles.friends}>
                            <img className={styles.friendImg} src={Placeholder} alt="" />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-10 * 1}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-10 * 2}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-10 * 3}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <span style={{ transform: `translateX(${-10 * 2.5}px)` }}>
                                +4 others
                            </span>
                            <img className={styles.arrow} src={downArrow.src} alt="" />
                        </span>
                    </span>
                    <span className={styles.entry}>
                        <p className={styles.name}>
                            <img
                                src="https://img.seadn.io/files/4a4061fa04f7ba8d41286bcc2ba22e76.png?fit=max&w=1000"
                                alt=""
                            />
                            Bankless
                        </p>
                        <p className={styles.joined}>Jul 22, 2021</p>
                        <p className={styles.score}>82.33</p>
                        <span className={styles.friends}>
                            <img className={styles.friendImg} src={Placeholder} alt="" />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-10 * 1}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-10 * 2}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-10 * 3}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <span style={{ transform: `translateX(${-10 * 2.5}px)` }}>
                                +4 others
                            </span>
                            <img className={styles.arrow} src={downArrow.src} alt="" />
                        </span>
                    </span>
                    <span className={styles.entry}>
                        <p className={styles.name}>
                            <img
                                src="https://img.seadn.io/files/4a4061fa04f7ba8d41286bcc2ba22e76.png?fit=max&w=1000"
                                alt=""
                            />
                            Bankless
                        </p>
                        <p className={styles.joined}>Jul 22, 2021</p>
                        <p className={styles.score}>82.33</p>
                        <span className={styles.friends}>
                            <img className={styles.friendImg} src={Placeholder} alt="" />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-10 * 1}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-10 * 2}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-10 * 3}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <span style={{ transform: `translateX(${-10 * 2.5}px)` }}>
                                +4 others
                            </span>
                            <img className={styles.arrow} src={downArrow.src} alt="" />
                        </span>
                    </span>
                    <span className={styles.entry}>
                        <p className={styles.name}>
                            <img
                                src="https://img.seadn.io/files/4a4061fa04f7ba8d41286bcc2ba22e76.png?fit=max&w=1000"
                                alt=""
                            />
                            Bankless
                        </p>
                        <p className={styles.joined}>Jul 22, 2021</p>
                        <p className={styles.score}>82.33</p>
                        <span className={styles.friends}>
                            <img className={styles.friendImg} src={Placeholder} alt="" />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-10 * 1}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-10 * 2}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-10 * 3}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <span style={{ transform: `translateX(${-10 * 2.5}px)` }}>
                                +4 others
                            </span>
                            <img className={styles.arrow} src={downArrow.src} alt="" />
                        </span>
                    </span>
                    <span className={styles.entry}>
                        <p className={styles.name}>
                            <img
                                src="https://img.seadn.io/files/4a4061fa04f7ba8d41286bcc2ba22e76.png?fit=max&w=1000"
                                alt=""
                            />
                            Bankless
                        </p>
                        <p className={styles.joined}>Jul 22, 2021</p>
                        <p className={styles.score}>82.33</p>
                        <span className={styles.friends}>
                            <img className={styles.friendImg} src={Placeholder} alt="" />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-10 * 1}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-10 * 2}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-10 * 3}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <span style={{ transform: `translateX(${-10 * 2.5}px)` }}>
                                +4 others
                            </span>
                            <img className={styles.arrow} src={downArrow.src} alt="" />
                        </span>
                    </span>
                    <span className={styles.entry}>
                        <p className={styles.name}>
                            <img
                                src="https://img.seadn.io/files/4a4061fa04f7ba8d41286bcc2ba22e76.png?fit=max&w=1000"
                                alt=""
                            />
                            Bankless
                        </p>
                        <p className={styles.joined}>Jul 22, 2021</p>
                        <p className={styles.score}>82.33</p>
                        <span className={styles.friends}>
                            <img className={styles.friendImg} src={Placeholder} alt="" />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-10 * 1}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-10 * 2}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-10 * 3}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <span style={{ transform: `translateX(${-10 * 2.5}px)` }}>
                                +4 others
                            </span>
                            <img className={styles.arrow} src={downArrow.src} alt="" />
                        </span>
                    </span>
                    <span className={styles.entry}>
                        <p className={styles.name}>
                            <img
                                src="https://img.seadn.io/files/4a4061fa04f7ba8d41286bcc2ba22e76.png?fit=max&w=1000"
                                alt=""
                            />
                            Bankless
                        </p>
                        <p className={styles.joined}>Jul 22, 2021</p>
                        <p className={styles.score}>82.33</p>
                        <span className={styles.friends}>
                            <img className={styles.friendImg} src={Placeholder} alt="" />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-10 * 1}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-10 * 2}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-10 * 3}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <span style={{ transform: `translateX(${-10 * 2.5}px)` }}>
                                +4 others
                            </span>
                            <img className={styles.arrow} src={downArrow.src} alt="" />
                        </span>
                    </span>
                    <span className={styles.entry}>
                        <p className={styles.name}>
                            <img
                                src="https://img.seadn.io/files/4a4061fa04f7ba8d41286bcc2ba22e76.png?fit=max&w=1000"
                                alt=""
                            />
                            Bankless
                        </p>
                        <p className={styles.joined}>Jul 22, 2021</p>
                        <p className={styles.score}>82.33</p>
                        <span className={styles.friends}>
                            <img className={styles.friendImg} src={Placeholder} alt="" />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-10 * 1}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-10 * 2}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-10 * 3}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <span style={{ transform: `translateX(${-10 * 2.5}px)` }}>
                                +4 others
                            </span>
                            <img className={styles.arrow} src={downArrow.src} alt="" />
                        </span>
                    </span>
                    <span className={styles.entry}>
                        <p className={styles.name}>
                            <img
                                src="https://img.seadn.io/files/4a4061fa04f7ba8d41286bcc2ba22e76.png?fit=max&w=1000"
                                alt=""
                            />
                            Bankless
                        </p>
                        <p className={styles.joined}>Jul 22, 2021</p>
                        <p className={styles.score}>82.33</p>
                        <span className={styles.friends}>
                            <img className={styles.friendImg} src={Placeholder} alt="" />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-10 * 1}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-10 * 2}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-10 * 3}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <span style={{ transform: `translateX(${-10 * 2.5}px)` }}>
                                +4 others
                            </span>
                            <img className={styles.arrow} src={downArrow.src} alt="" />
                        </span>
                    </span>
                </div>
            </div>
            <div className={styles.list_communities_mobile}>
                <h1 className={styles.title}>List of Communities</h1>
                <span className={styles.daoListCon}>
                    <div className={styles.daoEntry}>
                        <span className={styles.daoName}>
                            <img src="/grad.jpg" alt="" />
                            <h1>Bankless DAO</h1>
                        </span>
                        <h2>Jul 22, 2021 83.5% Attendence Score</h2>
                        <span className={styles.friends}>
                            <img className={styles.friendImg} src={Placeholder} alt="" />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-4 * 1}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-4 * 2}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-4 * 3}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <span
                                className={styles.text}
                                style={{
                                    transform: `translateX(${-4 * 2.5}px)`,
                                    width: "max-content",
                                }}
                            >
                                +4 others
                            </span>
                        </span>
                    </div>
                    <div className={styles.daoEntry}>
                        <span className={styles.daoName}>
                            <img src="/grad.jpg" alt="" />
                            <h1>Bankless DAO</h1>
                        </span>
                        <h2>Jul 22, 2021 83.5% Attendence Score</h2>
                        <span className={styles.friends}>
                            <img className={styles.friendImg} src={Placeholder} alt="" />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-4 * 1}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-4 * 2}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-4 * 3}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <span
                                className={styles.text}
                                style={{
                                    transform: `translateX(${-4 * 2.5}px)`,
                                    width: "max-content",
                                }}
                            >
                                +4 others
                            </span>
                        </span>
                    </div>
                    <div className={styles.daoEntry}>
                        <span className={styles.daoName}>
                            <img src="/grad.jpg" alt="" />
                            <h1>Bankless DAO</h1>
                        </span>
                        <h2>Jul 22, 2021 83.5% Attendence Score</h2>
                        <span className={styles.friends}>
                            <img className={styles.friendImg} src={Placeholder} alt="" />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-4 * 1}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-4 * 2}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-4 * 3}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <span
                                className={styles.text}
                                style={{
                                    transform: `translateX(${-4 * 2.5}px)`,
                                    width: "max-content",
                                }}
                            >
                                +4 others
                            </span>
                        </span>
                    </div>
                    <div className={styles.daoEntry}>
                        <span className={styles.daoName}>
                            <img src="/grad.jpg" alt="" />
                            <h1>Bankless DAO</h1>
                        </span>
                        <h2>Jul 22, 2021 83.5% Attendence Score</h2>
                        <span className={styles.friends}>
                            <img className={styles.friendImg} src={Placeholder} alt="" />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-4 * 1}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-4 * 2}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-4 * 3}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <span
                                className={styles.text}
                                style={{
                                    transform: `translateX(${-4 * 2.5}px)`,
                                    width: "max-content",
                                }}
                            >
                                +4 others
                            </span>
                        </span>
                    </div>
                    <div className={styles.daoEntry}>
                        <span className={styles.daoName}>
                            <img src="/grad.jpg" alt="" />
                            <h1>Bankless DAO</h1>
                        </span>
                        <h2>Jul 22, 2021 83.5% Attendence Score</h2>
                        <span className={styles.friends}>
                            <img className={styles.friendImg} src={Placeholder} alt="" />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-4 * 1}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-4 * 2}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <img
                                className={styles.friendImg}
                                style={{ transform: `translateX(${-4 * 3}px)` }}
                                src={Placeholder}
                                alt=""
                            />
                            <span
                                className={styles.text}
                                style={{
                                    transform: `translateX(${-4 * 2.5}px)`,
                                    width: "max-content",
                                }}
                            >
                                +4 others
                            </span>
                        </span>
                    </div>
                </span>
            </div>
        </>
    );
};