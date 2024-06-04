import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Easy to Use',
    Svg: require('@site/static/img/logo.svg').default,
    description: (
      <>
        Participate efficiently in cleaning and protecting your environment by reporting incidents such as wild garbage dumps, broken pipes, damaged roads, etc., using the MAP ACTION application. Take a photo of the incident, document it with a video, a voice message, or a text, and send it to the relevant authorities!
      </>
    ),
  },
  {
    title: 'Create Challenge',
    Svg: require('@site/static/img/logo.svg').default,
    description: (
      <>
        Create challenges to unite your community members around concrete actions you can take together. Unity is strength!
      </>
    ),
  },
  {
    title: 'Powered by Kaicedra CONSULTING',
    Svg: require('@site/static/img/logo.svg').default,
    description: (
      <>
        The more you report incidents or organize challenges, the more badges you earn, which unlock app features and allow you to win many prizes with our partners.
      </>
    ),
  },
];


function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
